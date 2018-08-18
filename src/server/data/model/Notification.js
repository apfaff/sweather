const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true
  },
  delivery: {
    date: Date,
    hour: Number,
    minute: Number
  },
  temperature: {
    scale: String,
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
