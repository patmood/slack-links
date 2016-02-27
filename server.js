const koa = require('koa')
const route = require('koa-route')
const query = require('pg-query')
const dbUrl = 'postgres:///slack_links'
const templates = require('./templates')

query.connectionParameters = process.env.DATABASE_URL || dbUrl

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
