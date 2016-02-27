const koa = require('koa')
const route = require('koa-route')
global.Promise = require('bluebird')
const redis = require('redis')
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)
const redClient = redis.createClient()
redClient.on('error', (err) => console.log(err))

const dbUrl = 'postgres:///slack_links'
const query = require('pg-query')
query.connectionParameters = process.env.DATABASE_URL || dbUrl

const templates = require('./templates')
const oneHour = 1000 * 60 * 60

redClient.getAsync('lastFetch')
  .then((ts) => {
    console.log(oneHour)
    if (Date.now() - ts > oneHour) {
      // fetch new messages
      redClient.set('lastFetch', Date.now())
    }
  })

const app = koa()

// Log request times
app.use(function * (next) {
  const start = process.hrtime()
  yield next
  console.log(process.hrtime(start), this.request.path)
})

app.use(route.get('/links', function * () {
  const links = yield query('select * from link_messages')
  this.body = links[0]
}))

app.use(route.get('/', function * () {
  const links = yield query('select * from link_messages')
  this.body = templates.linkPage(links[0])
}))

app.listen(7777, () => console.info('🌎 Listening on 7777'))
