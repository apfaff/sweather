import { AsyncStorage } from 'react-native'

const LOCATION = 'location'
const TEMPERATURE = 'temperature'
const DELIVERY_TIME = 'delivery'
const NOTIFICATIONS = 'notifications'
const INITIAL_LAUNCH = 'initialLaunch'
const BACKGROUND_IMAGE = 'backgroundImage'

const _storeData = key => async value => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(err)
  }
}

const _retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return JSON.parse(value)
    }
    return false
  } catch (err) {
    console.error(err)
  }
}

const _retrieveMultipleData = async keys => {
  try {
    const stores = await AsyncStorage.multiGet(keys)
    if (stores !== null) {
      return stores
    }
    return false
  } catch (err) {
    console.error(err)
  }
}

export const getTemperature = () => _retrieveData(TEMPERATURE)
export const getDeliveryTime = () => _retrieveData(DELIVERY_TIME)
export const getLocation = () => _retrieveData(LOCATION)
export const getNotifications = () => _retrieveData(NOTIFICATIONS)
export const getSettings = () => _retrieveMultipleData([TEMPERATURE, NOTIFICATIONS, DELIVERY_TIME])
export const getBackgroundImage = () => _retrieveData(BACKGROUND_IMAGE)

export const setTemperature = _storeData(TEMPERATURE)
export const setDeliveryTime = _storeData(DELIVERY_TIME)
export const setLocation = _storeData(LOCATION)
export const setNotifications = _storeData(NOTIFICATIONS)
export const setBackgroundImage = _storeData(BACKGROUND_IMAGE)

const getInitialLaunch = _retrieveData(INITIAL_LAUNCH)
const setInitialLaunch = _storeData(INITIAL_LAUNCH)
export const isInitialLaunch = async () => {
  try {
    const isInitialLaunch = getInitialLaunch()
    if (!isInitialLaunch) return false
    setInitialLaunch(true)
    return true
  } catch (err) {
    return false
  }
}
