import ENV from '../env'

const weatherUrl = query => `${ENV.OPEN_WEATHER_API}?${query}&appid=${ENV.OPEN_WEATHER_API_KEY}`

// TODO: extract relevant data: weather[0], main, name

module.exports = {
  async requestCurrentWeatherDataByCityId (cityId) {
    const url = weatherUrl(`id=${cityId}`)
    const res = await fetch(url)
    return res.json()
  },
  async requestCurrentWeatherDataByCityName (cityName, countryCode) {
    const url = weatherUrl(`q=${cityName},${countryCode}`)
    const res = await fetch(url)
    return res.json()
  },
  async requestCurrentWeatherDataByZip (zip, countryCode) {
    const url = weatherUrl(`q=${zip},${countryCode}`)
    const res = await fetch(url)
    return res.json()
  },
  async requestCurrentWeatherDataByLatLon (lat, lng) {
    const url = weatherUrl(`lat=${lat}&lon=${lng}`)
    const res = await fetch(url)
    return res.json()
  },
  kelvinToCelsius (degrees) {
    return Math.ceil(degrees - 273.15)
  },
  kelvinToFahrenheit (degrees) {
    return Math.ceil(degrees * (9 / 5) - 459.67)
  }
}
