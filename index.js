const request = require('request')
const pg = require('pg')
const query = require('pg-query')
const dbUrl = 'postgres:///slack_links'

query.connectionParameters = process.env.DATABASE_URL || dbUrl

const opts = {
  token: 'xoxp-21485397347-21487726449-21489223078-866dafb21c',
  channel: 'C0MEBU4NB',
  oldest: 1,
  pretty: 1,
}

const getSlackHistory = (options) => {
  request({
    url: 'https://slack.com/api/channels.history',
    json: true,
    qs: options || {},
  }, (err, response, body) => {
    if (err) throw err
    if (!body.ok) throw body.error
    // console.log(body)
    body.messages.forEach((msg) => {
      const links = msg.text.match(/<(\S+)>/gi)
      if (!links) return false
      const urls = links.filter((link) => link.match('http'))
      if (!urls.length > 0) return false
      console.log(`\x1b[33m${JSON.stringify(msg , null, 2)}\x1b[0m`)
      query('insert into link_messages (ts, links, message, username) values ($1, $2, $3, $4)',
        [msg.ts, urls, msg.text, msg.user])
        .then((result) => console.log('inserted'))
        .catch((err) => console.log(err))
      return urls
    })
  })
}

getSlackHistory(opts)
