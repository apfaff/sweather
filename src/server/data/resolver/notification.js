const moment = require('moment-timezone')

const Notification = require('../model/Notification')
const { scheduleDailyJob, cancelJob, reScheduleDailyJob } = require('../../util/scheduler')
const { sendPushNotification } = require('../../util/pushService')

const scheduleOrReSchedule = (record) => {
  let document = {...record.toJSON()}
  let delivery = moment(document.delivery.date).tz(process.env.TIMEZONE || 'Europe/Berlin')
  let rule = {
    hour: delivery.hour,
    minute: delivery.minute
  }
  try {
    reScheduleDailyJob(document.token, rule)
  } catch (err) {
    scheduleDailyJob(() => {
      sendPushNotification(document.token)
    })(document.token, rule)
  }
}

// reindex persisted notifications (i.e on server restart)
const reindex = () => {
  Notification.find().cursor().on('data', (record) => {
    console.info(`scheduled ${record}`)
    scheduleOrReSchedule(record)
  })
}
reindex()

module.exports = {
  async register (req, res, next) {
    const notification = new Notification(req.body)
    try {
      await notification.save()
    } catch (err) {
      console.error(err)
    } finally {
      scheduleOrReSchedule(notification)
      res.send(200)
      next()
    }
  },
  async update (req, res, next) {
    try {
      let token = req.params.token
      await Notification.update(
        { token: token },
        { $set: { ...req.body, token: token } },
        { runValidators: true })

      let record = await Notification.findOne({token: token})
      scheduleOrReSchedule(record)
      res.send(200)
    } catch (err) {
      res.send(500)
    } finally {
      next()
    }
  },
  async deregister (req, res, next) {
    let token = req.params.token
    try {
      await Notification.remove({ token: token })
    } catch (err) { console.error(err) }

    try {
      cancelJob(token)
    } catch (err) { console.error(err) }

    res.send(200)
    return next()
  }
}
