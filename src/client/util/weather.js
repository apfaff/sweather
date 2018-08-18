import ENV from '../env'

const weatherUrl = query => `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${ENV.OPEN_WEATHER_API_KEY}`

// TODO: extract relevant data: weather[0], main, name

export const requestCurrentWeatherDataByCityId = async cityId => {
  const url = weatherUrl(`id=${cityId}`)
  const res = await fetch(url)
  return res.json()
}

export const requestCurrentWeatherDataByCityName = async (cityName, countryCode) => {
  const url = weatherUrl(`q=${cityName},${countryCode}`)
  const res = await fetch(url)
  return res.json()
}

export const requestCurrentWeatherDataByZip = async (zip, countryCode) => {
  const url = weatherUrl(`q=${zip},${countryCode}`)
  const res = await fetch(url)
  return res.json()
}

export const requestCurrentWeatherDataByLatLon = async (lat, lng) => {
  const url = weatherUrl(`lat=${lat}&lon=${lng}`)
  const res = await fetch(url)
  return res.json()
}

export const kelvinToCelsius = degrees => {
  return Math.ceil(degrees - 273.15)
}

export const kelvinToFahrenheit = degrees => {
  return Math.ceil(degrees * (9 / 5) - 459.67)
}

export const renderTemperatureInScale = (scale, temperature) => {
  return scale === 'celsius'
    ? `${kelvinToCelsius(temperature)} °C`
    : `${kelvinToFahrenheit(temperature)} °F`
}
