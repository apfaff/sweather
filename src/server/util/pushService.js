const Notification = require('../data/model/Notification')
const Expo = require('expo-server-sdk').Expo

let expo = new Expo()

const expoPushServiceMaintenanceJob = async (messageFactory) => {
  //  resolve open expo tickets
  Notification.find({
    openExpoPushTickets: { $exists: true, $not: {$size: 0} }
  })
    .cursor().on('data', async (record) => {
      console.info(`resolving open tickets for ${record.ticket}`)
      let ticketIds = record.openExpoPushTickets.map((ticket) => ticket.id)
      let receiptIdChunks = expo.chunkPushNotificationReceiptIds(ticketIds)
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk)
          // The receipts specify whether Apple or Google successfully received the
          // notification and information about an error, if one occurred.
          for (let [ticketId, receipt] of Object.entries(receipts)) {
            //  remove ticketId from openExpoPushTickets
            await Notification.update({token: record.token}, { $pull: { openExpoPushTickets: {
              id: ticketId
            } } })
            //  add it to expoPushReceipts
            await Notification.update({token: record.token}, { $push: { expoPushReceipts: {
              id: ticketId,
              date: new Date(),
              ...receipt
            } } })
          }
        } catch (error) {
          console.error(error)
        }
      }
    })

  //  find notifications with rejected tickets
  let rejectedNotifications = await Notification.find({
    expoRejectedTickets: { $exists: true, $not: {$size: 0} }
  })

  //  TODO: notifications with *specific* errors in their expoPushReceipts should not be rescheduled

  //  clear rejected tickets from notifications, those are about to be rescheduled again..
  await Notification.update({
    expoRejectedTickets: { $exists: true, $not: {$size: 0} }
  }, { $set: { expoRejectedTickets: [] } })

  // re send rejected tickets
  let rejectedPushTokens = rejectedNotifications.map((notification) => notification.token)
  await sendPushNotifications(rejectedPushTokens, messageFactory)
}

const sendPushNotifications = async (tokens, messageFactory) => {
  tokens = tokens.filter((token) => {
    let isValid = Expo.isExpoPushToken(token)
    if (!isValid) console.warn(`${token} is not an expo push token. ignoring for now...`)
    return isValid
  })
  let messages = await Promise.all(
    tokens.map((token) => messageFactory(token))
  )

  let chunks = expo.chunkPushNotifications(messages)
  let tickets = []
  for (let chunk of chunks) {
    let ticketChunk = await expo.sendPushNotificationsAsync(chunk)
    tickets.push(...ticketChunk)
  }

  let rejectedTickets = []
  let receiptIds = []
  let reports = tickets.map((value, index) => {
    return {
      token: tokens[index],
      ticket: value
    }
  })
  for (let report of reports) {
    let notification = await Notification.findOne({token: report.token})

    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (report.ticket.id) {
      receiptIds.push(report.ticket)

      //  save open ticket, it will be resolved later
      notification.openExpoPushTickets.push({
        date: new Date(),
        ...report.ticket
      })
      await notification.save()
    } else {
      rejectedTickets.push(report.ticket)

      // note this notification for later rescheduling
      notification.expoRejectedTickets.push({
        date: new Date(),
        ...report.ticket
      })
      await notification.save()
    }
  }

  return {
    rejectedTickets: rejectedTickets,
    receiptIds: receiptIds
  }
}

class PushService {
  constructor (messageFactory, interval = 30 * 60 * 1000) {
    this.messageFactory = messageFactory

    this.pushServiceMaintenanceJob = () => {
      expoPushServiceMaintenanceJob(this.messageFactory)
    }
    this.pushServiceMaintenanceJob()
    setInterval(this.pushServiceMaintenanceJob, interval)
  }

  async sendPushNotification (token) {
    return sendPushNotifications([token], this.messageFactory)
  }

  async sendPushNotifications (tokens) {
    return sendPushNotifications(tokens, this.messageFactory)
  }
}

module.exports = PushService
