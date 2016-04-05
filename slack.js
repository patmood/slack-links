const request = require('request')
const Readable = require('stream').Readable

const getHistory = (options, next) => {
  console.log(`\x1b[33m${JSON.stringify(options , null, 2)}\x1b[0m`)
  request({
    url: 'https://slack.com/api/channels.history',
    json: true,
    qs: options || {},
  }, (err, response, body) => {
    if (err) return next(err)
    if (!body.ok) return next(body.error)
    next(null, body)
  })
}

const allHistoryStream = (options) => {
  const rs = new Readable()
  rs._read = () => {
    getHistory(options, (err, body) => {
      if (err) {
        console.log(err)
        return rs.push(null)
      }

      if (body.messages.length === 0) {
        console.log('No new messages, ending stream')
        return rs.push(null)
      }

      const latest = body.messages[body.messages.length - 1].ts
      options = Object.assign({}, options, { latest: latest })
      console.log(
        'length:', body.messages.length,
        'has_more:', body.has_more,
        'OK:', body.ok,
        'latest:', latest
      )
      console.log(`Pushing ${body.messages.length} messages to stream`)
      rs.push(JSON.stringify(body.messages))
    })
  }
  return rs
}

const linkReducer = (memo, msg) => {
  const links = msg.text.match(/<(\S+)>/gi)
  if (!links) return memo

  const urls = links.filter((link) => link.match('http'))
  if (!urls.length > 0) return memo
  msg.urls = urls
  return memo.concat([ msg ])
}

const extractLinks = (message) => {
  // Dont include file uploads as links
  if (message.subtype === "file_share") return message
  if (!message.text) return message

  // Check if contains link
  const links = message.text.match(/<(\S+)>/gi)
  if (!links) return message

  // Add list of links as new field for easy access
  const urls = links.filter((link) => link.match('http'))
  if (!urls.length > 0) return message
  message.urls = urls
  return message
}

module.exports = {
  getHistory,
  linkReducer,
  extractLinks,
  allHistoryStream,
}
