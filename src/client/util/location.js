import { Location, Permissions } from 'expo'
import { setLocation, getLocation } from './storage'

export const getLocationAsync = async () => {
  try {
    const permissions = await Permissions.askAsync(Permissions.LOCATION)
    if (permissions.status !== 'granted') {
      // TODO: ask user to give permissions for location service
      return false
    }

    const status = await Location.getProviderStatusAsync()
    if (!status.locationServicesEnabled) {
      // TODO: ask user to enable GPS
      return false
    }

    const position = await Location.getCurrentPositionAsync({})
    if (position === null) {
      const storedLocation = await getLocation()
      if (!storedLocation) return false
      return storedLocation
    }

    const addresses = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
    const { city, country, postalCode } = addresses[0]

    const location = {
      city,
      country,
      lng: position.coords.longitude,
      lat: position.coords.latitude,
      postalCode
    }

    await setLocation(location)
    return location
  } catch (err) {
    console.error(err)
  }
}
