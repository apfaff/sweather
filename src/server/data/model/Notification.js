const mongoose = require('mongoose')

const ExpoPushReceipt = new mongoose.Schema({
  id: String,
  date: Date,
  status: String,
  details: Object
})

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
  },
  openExpoPushTickets: [ExpoPushReceipt],
  expoRejectedTickets: [ExpoPushReceipt],
  expoPushReceipts: [ExpoPushReceipt]
})

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification
