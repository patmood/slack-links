var request = require('request')

request({
  url: 'https://slack.com/api/channels.history',
  json: true,
  qs: {
    token: 'xoxp-4238637166-6341684102-21486580243-5d78808e62',
    channel: 'C0470JR5N',
    oldest: 1,
    pretty: 1,
  }
}, (err, response, body) => {
  if (err) throw err
  if (!body.ok) throw body.error
  console.log(body)
})
