require('dotenv').load()
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
const oneHour = 60 * 60

const testOpts = {
  token: process.env.SLACK_TOKEN,
  channel: 'C0470JR5N',//'C0MEBU4NB',
  oldest: 1,
  pretty: 1,
  count: 400,
}

const fetchHistory = (options) => {
  return redClient.getAsync('lastFetch')
    .then((ts) => {
      if ((Date.now() / 1000) - ts < oneHour) return console.log('Up to date')

      console.log('Fetching new messages')
      redClient.set('lastFetch', Date.now() / 1000)
      const newOptions = Object.assign({}, options, { oldest: ts || 1 })
      return slack.getHistory(newOptions)
    }).then((body) => {
      if (!body || !body.messages) return
      const promises = body.messages.reduce((memo, msg) => {
        const links = msg.text.match(/<(\S+)>/gi)
        if (!links) return memo

        const urls = links.filter((link) => link.match('http'))
        if (!urls.length > 0) return memo

        return memo.concat([
          query('insert into link_messages (ts, links, message, username, channel) values ($1, $2, $3, $4, $5)',
          [msg.ts, urls, msg.text, msg.user, options.channel])
        ])
      }, [])
      return Promise.all(promises)
    })
}

const app = koa()

// Log request times
app.use(function * (next) {
  const start = process.hrtime()
  yield next
  console.log(process.hrtime(start), this.request.path)
})

app.use(route.get('/links', function * () {
  yield fetchHistory(testOpts)
  const links = yield query('select * from link_messages')
  this.body = links[0]
}))

app.use(route.get('/', function * () {
  yield fetchHistory(testOpts)
  const lastFetch = yield redClient.getAsync('lastFetch')
  const links = yield query('select * from link_messages')
  this.body = templates.linkPage({ messages: links[0], lastFetch: lastFetch })
}))

app.use(route.get('/reset', function * () {
  yield redClient.delAsync('lastFetch')
  this.body = 'OK'
}))

app.listen(7777, () => console.info('🌎 Listening on 7777'))
