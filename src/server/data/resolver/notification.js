const moment = require('moment-timezone')

const Notification = require('../model/Notification')
const { scheduleDailyJob, cancelJob, reScheduleDailyJob } = require('../../util/scheduler')
const PushService = require('../../util/pushService')
const messageFactory = require('../../util/pushMessageFactory')
const pushService = new PushService(messageFactory)

const rescheduleOrSchedule = (record) => {
  let delivery = moment(record.delivery.date).tz(process.env.TIMEZONE || 'Europe/Berlin')
  let rule = {
    hour: delivery.hour,
    minute: delivery.minute
  }
  try {
    reScheduleDailyJob(record.token, rule)
  } catch (err) {
    scheduleDailyJob(() => {
      pushService.sendPushNotification(record.token)
    })(record.token, rule)
  }
}

// reindex persisted notifications (i.e on server restart)
const reindex = () => {
  Notification.find().cursor().on('data', (record) => {
    console.info(`scheduled ${record.delivery} for ${record.token}`)
    rescheduleOrSchedule(record.toJSON())
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
      rescheduleOrSchedule(notification.toJSON())
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
      rescheduleOrSchedule(record.toJSON())
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
