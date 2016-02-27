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

const slack = require('./slack')
const templates = require('./templates')
const oneHour = 1000 * 60 * 60

const testOpts = {
  token: 'xoxp-21485397347-21487726449-21489223078-866dafb21c',
  channel: 'C0MEBU4NB',
  oldest: 1,
  pretty: 1,
}

// const isFresh = () => {}

const fetchHistory = (options) => {
  redClient.getAsync('lastFetch')
    .then((ts) => {
      if (Date.now() - ts > oneHour) {
        console.log('Fetching new messages')
        redClient.set('lastFetch', Date.now())
        return slack.getHistory(options)
      } else {
        console.log('Message list up to date')
        return []
      }
    })
    .then((messages) => {
      messages.forEach((msg) => {
        const links = msg.text.match(/<(\S+)>/gi)
        if (!links) return false

        const urls = links.filter((link) => link.match('http'))
        if (!urls.length > 0) return false

        query('insert into link_messages (ts, links, message, username, channel) values ($1, $2, $3, $4, $5)',
          [msg.ts, urls, msg.text, msg.user, options.channel])
          .then((result) => console.log('inserted'))
          .catch((err) => console.log(err))
      })
    })
}

fetchHistory(testOpts)

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

app.use(route.get('/reset', function * () {
  yield redClient.delAsync('lastFetch')
  this.body = 'OK'
}))

app.listen(7777, () => console.info('🌎 Listening on 7777'))
