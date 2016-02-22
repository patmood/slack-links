const request = require('request')
const linksFromString = require('./links-from-string')

const lastFetch = 1
const links = []

const token = 'xoxp-4238637166-6341684102-21486580243-5d78808e62'
const channel = 'C0470JR5N'
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
    }
  }, (err, response, body) => {
    if (err) throw err
    if (!body.ok) throw body.error
    // console.log(body)
    body.messages.forEach((msg) => {
      const links = linksFromString(msg.text)
      // console.log(msg)
      if (links.length) console.log(links)
    })
  })
}

getHistory(token, channel, oldest, pretty)
