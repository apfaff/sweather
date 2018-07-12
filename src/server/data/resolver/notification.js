const Notification = require('../model/Notification')

module.exports = {
  async register (req, res, next) {
    const notification = new Notification(req.body)
    const response = await notification.save(err => {
      if (err) console.error(err.message)
      // TODO: schedule push task
    })

    res.send(response)
    return next()
  },
  async unregister (req, res, next) {
    Notification.remove({ token: req.params.token }, err => {
      if (err) console.error(err.message)
      // TODO: remove scheduling for push
    })

    res.send(200)
    return next()
  }
}
