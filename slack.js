const request = require('request')

const getHistory = (options) => {
  return new Promise((resolve, reject) => {
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
