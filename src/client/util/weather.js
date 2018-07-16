const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const APP_ID = `appid=${process.env.OPEN_WEATHER_API_KEY}`

const weatherUrl = query => `${WEATHER_API_URL}?q=${query}&${APP_ID}`

module.exports = {
  async requestCurrentWeatherDataByCityId (cityId) {
    const url = weatherUrl(`id=${cityId}`)
    const res = await fetch(url)
    return res
  },
  async requestCurrentWeatherDataByCityName (cityName, countryCode) {
    const url = weatherUrl(`${cityName},${countryCode}`)
    const res = await fetch(url)
    return res
  },
  async requestCurrentWeatherDataByZip (zip, countryCode) {
    const url = weatherUrl(`${zip},${countryCode}`)
    const res = await fetch(url)
    return res
  },
  async requestCurrentWeatherDataByLatLon (lat, lon) {
    const url = weatherUrl(`lat=${lat}&lon=${lon}`)
    const res = await fetch(url)
    return res
  },
  kelvinToCelsius (degrees) {
    return Math.ceil(degrees - 273.15)
  },
  kelvinToFahrenheit (degrees) {
    return Math.ceil(degrees * (9 / 5) - 459.67)
  }
}
