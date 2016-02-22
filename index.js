const request = require('request')
const linksFromString = require('./links-from-string')

const lastFetch = 1
const links = []

const token = 'xoxp-21485397347-21487726449-21489223078-866dafb21c'
const channel = 'C0MEBU4NB'
const oldest = 1
const pretty = 1

const getHistory = (token, channel, oldest, pretty) => {
  request({
    url: 'https://slack.com/api/channels.history',
    json: true,
    qs: {
      token,
      channel,
      oldest,
      pretty,
    },
  }, (err, response, body) => {
    if (err) throw err
    if (!body.ok) throw body.error
    // console.log(body)
    body.messages.forEach((msg) => {
      const links = msg.text.match(/<(\S+)>/gi)
      if (!links) return false
      const urls = links.filter((link) => link.match('http'))
      // Save message to db here
      return urls
    })
  })
}

getHistory(token, channel, oldest, pretty)
