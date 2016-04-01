const request = require('request')
const Readable = require('stream').Readable

const getHistory = (options, next) => {
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
        rs.push(null)
      }

      rs.push(JSON.stringify(body.messages))
      console.log(`Pushed ${body.messages.length} messages to stream`)

      if (body.has_more) {
        const lastMessage = body.messages[body.messages.length - 1].ts
        options = Object.assign({}, options, { oldest: lastMessage })
      } else {
        return rs.push(null)
      }
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
