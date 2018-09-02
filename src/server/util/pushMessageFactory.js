const { requestCurrentWeatherDataByLatLon } = require('./weather')
const Notification = require('../data/model/Notification')

/**
 * creates an expo push message object with payload
 *
 * @param {string} token - expo push token
 * @returns {object} expo push message object
 */
module.exports = async (token) => {
  let notification = await Notification.findOne({token: token})
  let response = await requestCurrentWeatherDataByLatLon(
    notification.location.lat,
    notification.location.lng
  )

  // TODO: i18n
  // TODO: include common module that resolves texts?
  let text = {
    title: '',
    body: 'This is a test notification'
  }

  return {
    to: token,
    sound: 'default',
    ...text,
    data: response
  }
}
