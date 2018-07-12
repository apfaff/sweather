require('dotenv').config()

const restify = require('restify')
const { requestCurrentWeatherDataByZip } = require('./util/weatherApi')

const respond = async (req, res, next) => {
  const weather = await requestCurrentWeatherDataByZip(req.query.zip, req.query.country)
  res.send(weather)
  return next()
}

const server = restify.createServer()
server.use(restify.plugins.queryParser())

server.get('/weather-report', respond)
server.head('/weather-report', respond)

server.listen(8080, () => console.log(`${server.name} listening on ${server.url}`))
