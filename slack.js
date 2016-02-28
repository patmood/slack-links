const request = require('request')

const getHistory = (options) => {
  return new Promise((resolve, reject) => {
    console.log(`\x1b[33m${JSON.stringify('SLACK REQUEST' , null, 2)}\x1b[0m`)
    console.log(`\x1b[33m${JSON.stringify(options, null, 2)}\x1b[0m`)
    request({
      url: 'https://slack.com/api/channels.history',
      json: true,
      qs: options || {},
    }, (err, response, body) => {
      if (err) return reject(err)
      if (!body.ok) return reject(body.error)

      resolve(body.messages)
    })
  })
}

module.exports = {
  getHistory,
}
