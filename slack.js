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
      resolve(body)
    })
  })
}

const allHistory = (options, allMessages) => {
  allMessages = allMessages || []
  return getHistory(options)
    .then((body) => {
      allMessages = allMessages.concat(body.messages)
      console.log('# msgs', allMessages.length)
      if (body.has_more) {
        const lastMessage = body.messages[body.messages.length - 1].ts
        const newOpts = Object.assign({}, options, { oldest: lastMessage })
        console.log('fetching again')
        return allHistory(newOpts, allMessages)
      } else {
        return allMessages
      }
    })
}

const linkReducer = (memo, msg) => {
  const links = msg.text.match(/<(\S+)>/gi)
  if (!links) return memo

  const urls = links.filter((link) => link.match('http'))
  if (!urls.length > 0) return memo
  msg.urls = urls
  return memo.concat([ msg ])
}

module.exports = {
  getHistory,
  allHistory,
  linkReducer,
}

// if (!module.parent) {
//   require('dotenv').load()
//   const testOpts = {
//     token: process.env.SLACK_TOKEN,
//     channel: process.env.SLACK_CHANNEL,
//     oldest: 1,
//     pretty: 1,
//     count: 400,
//   }
//   allHistory(testOpts).then((msgs) => {
//     console.log('final count', msgs.length)
//   })
// }
