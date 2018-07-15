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
  async update (req, res, next) {
    Notification.update(
      { token: req.params.token },
      { $set: { ...req.body, token: req.params.token } },
      { runValidators: true },
      err => {
        if (err) console.error(err)
        // TODO: update scheduled task for token
      })

    res.send(200)
    return next()
  },
  async deregister (req, res, next) {
    Notification.remove({ token: req.params.token }, err => {
      if (err) console.error(err.message)
      // TODO: remove scheduling for push
    })

    res.send(200)
    return next()
  }
}
