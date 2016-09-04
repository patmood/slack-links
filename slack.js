'use strict'

const request = require('request')
const Readable = require('stream').Readable

const getHistory = (options, next) => {
  console.log('fetching with options', options)
  // console.log(`\x1b[33m${JSON.stringify(options , null, 2)}\x1b[0m`)
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
  const stream = new Readable()
  var has_more = true
  stream._read = () => {
    if (!has_more) {
      console.log('Last request has_more == false, ending stream')
      return stream.push(null)
    }
    getHistory(options, (err, body) => {
      if (err) {
        console.log(err)
        return stream.push(null)
      }

      if (body.messages.length === 0) {
        console.log('No new messages, ending stream')
        return stream.push(null)
      }

      const latest = body.messages[body.messages.length - 1].ts
      options = Object.assign({}, options, { latest: latest })
      has_more = body.has_more
      console.log(`Pushing ${body.messages.length} messages to stream. More to come? ${has_more}. Latest: ${latest}`)
      stream.push(JSON.stringify(body.messages))
    })
  }
  return stream
}

// like above but doesn't re-encode decoded json,
// because it gets immediately decoded by `streamReader` in the server module
// also handles backpressure - if calls to push ever return false, then
// the consumer doesn't want any more values and we wait until they call
// read before doing any more work
const allHistoryStream2 = (options) => {
  let fetching = false
  let slackHasMore = true
  let msgs = []
  return new Readable({
    // a stream of objects, not binary data (which is the default)
    objectMode:true,
    read() {
      let readerWantsMore = true
      while (readerWantsMore && msgs.length) { readerWantsMore = this.push(msgs.shift()) }
      if (!readerWantsMore) return
      // reader wants more but no more to give so end
      if (!slackHasMore) { return this.push(null) }
      // otherwise, fetch more (unless we're already doing that)
      if (!fetching) {
        fetching = true
        getHistory(options, (err, body) => {
          // errors get emitted
          if (err) { return this.emit('error', err) }
          slackHasMore = body.has_more
          const latest = body.messages[body.messages.length - 1].ts
          Object.assign(options, {latest})
          for (let m of body.messages) msgs.push(m)
          fetching = false
          this._read() // recurse
        })
      }
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

const extractLinks = (message) => {
  // Dont include file uploads as links
  if (message.subtype === 'file_share') return message
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
  allHistoryStream2
}
