require('dotenv').load()
const through2 = require('through2')
const koa = require('koa')
const auth = require('koa-basic-auth')
const route = require('koa-route')
global.Promise = require('bluebird')
const redis = require('redis')
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)
const redClient = redis.createClient({ url: process.env.REDIS_URL })
redClient.on('error', (err) => { throw err })

const query = require('pg-query')
query.connectionParameters = process.env.DATABASE_URL

const slack = require('./slack')
const templates = require('./templates')
const oneHour = 60 * 60 * 1000

const testOpts = {
  token: process.env.SLACK_TOKEN,
  channel: process.env.SLACK_CHANNEL,
  // pretty: 1,
  count: 100,
}

const fetchHistory = (options) => {
  return redClient.getAsync('lastFetch')
    .then((ts) => {
      if (Date.now() - ts < oneHour) return console.log('Up to date')
      redClient.set('lastFetch', Date.now())
      const newOptions = Object.assign({}, options, { oldest: ts })
      slack.allHistoryStream(newOptions).pipe(streamReader)
    })
}

// Stream Reader
const streamReader = through2.obj(function (chunk, enc, callback) {
  const result = chunk.toString()
  this.push(JSON.parse(result))
  callback()
})

streamReader.on('data', messages => {
  messages.forEach((msg) => {
    const msgWithUrl = slack.extractLinks(msg)
    if (!msgWithUrl.urls) return false
    query(
      'insert into link_messages (ts, links, message, username, channel) values ($1, $2, $3, $4, $5)',
      [
        msgWithUrl.ts,
        msgWithUrl.urls,
        msgWithUrl.text,
        msgWithUrl.user,
        process.env.SLACK_CHANNEL,
      ]
    )
    .then(() => console.log('Slack message saved'))
    .catch((err) => { throw err })
  })
})

streamReader.on('error', function handleError (err) {
  console.log('Stream Error:', err)
  this.end()
})

const app = koa()

// Handle 401
app.use(function * (next) {
  try {
    yield next
  } catch (err) {
    console.log(err.status)
    if (err.status === 401) {
      this.status = 401
      this.set('WWW-Authenticate', 'Basic')
      this.body = 'You shall not pass'
    } else {
      throw err
    }
  }
})

// Authentication
if (process.env.NODE_ENV !== 'DEVELOPMENT') {
  if (!process.env.AUTH_NAME || !process.env.AUTH_PASS) throw new Error('Auth name and pass required')
  app.use(auth({ name: process.env.AUTH_NAME, pass: process.env.AUTH_PASS }))
}

// Get history on startup
fetchHistory(testOpts)

// Update history every 2 hours
setInterval(() => fetchHistory(testOpts), oneHour)

// Log request times
app.use(function * (next) {
  const start = process.hrtime()
  yield next
  console.log(process.hrtime(start), this.request.path)
})

// ROUTES
app.use(route.get('/links', function * () {
  yield fetchHistory(testOpts)
  const links = yield query('select * from link_messages')
  this.body = links[0]
}))

app.use(route.get('/', function * () {
  const lastFetch = yield redClient.getAsync('lastFetch')
  const links = yield query('select * from link_messages')
  this.body = templates.linkPage({ messages: links[0], lastFetch: lastFetch })
}))

app.use(route.get('/reset', function * () {
  yield redClient.delAsync('lastFetch')
  this.body = 'OK'
}))

app.listen(process.env.PORT || 7777, () => console.info('🌎 Listening on 7777'))
