require('dotenv').config()
require('./data/mongodb')

const restify = require('restify')
const { requestCurrentWeatherDataByZip } = require('./util/weatherApi')
const { register, unregister } = require('./data/resolver/notification')

const respond = async (req, res, next) => {
  const weather = await requestCurrentWeatherDataByZip(req.query.zip, req.query.country)
  res.send(weather)
  return next()
}

const server = restify.createServer()
server.use(restify.plugins.fullResponse())
server.use(restify.plugins.gzipResponse())
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/weather-report', respond)
server.head('/weather-report', respond)

server.post('/register', register)
server.post('/unregister/:token', unregister)

server.listen(3000, () => console.log(`${server.name} listening on ${server.url}`))
