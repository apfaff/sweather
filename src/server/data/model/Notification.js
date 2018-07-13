const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true
  },
  delivery: {
    hour: Number,
    minute: Number
  },
  temperature: {
    cold: Number,
    warm: Number
  },
  location: {
    lat: Number,
    lng: Number,
    name: String
  }
})

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification