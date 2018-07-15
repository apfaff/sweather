import { AsyncStorage } from 'react-native'

const INITIAL_LAUNCH = 'initialLaunch'

const setAppLaunched = () => {
  AsyncStorage.setItem(INITIAL_LAUNCH, 'true')
}

const checkIfInitialLaunch = async () => {
  try {
    const isInitialLaunch = await AsyncStorage.getItem(INITIAL_LAUNCH)
    if (isInitialLaunch === null) {
      setAppLaunched()
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export default checkIfInitialLaunch
