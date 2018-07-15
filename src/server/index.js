require('dotenv').config()
require('./data/mongodb')

const restify = require('restify')
const { register, update, deregister } = require('./data/resolver/notification')

const server = restify.createServer()
server.use(restify.plugins.fullResponse())
server.use(restify.plugins.gzipResponse())
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.post('/register', register)
server.put('/register/:token', update)
server.del('/deregister/:token', deregister)

server.listen(3000, () => console.log(`${server.name} listening on ${server.url}`))
