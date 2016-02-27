const request = require('request')
// const dbUrl = 'postgres:///slack_links'
// const query = require('pg-query')
// query.connectionParameters = process.env.DATABASE_URL || dbUrl

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
      // body.messages.forEach((msg) => {
      //   const links = msg.text.match(/<(\S+)>/gi)
      //   if (!links) return false
      //
      //   const urls = links.filter((link) => link.match('http'))
      //   if (!urls.length > 0) return false
      //
      //   query('insert into link_messages (ts, links, message, username, channel) values ($1, $2, $3, $4, $5)',
      //     [msg.ts, urls, msg.text, msg.user, options.channel])
      //     .then((result) => console.log('inserted'))
      //     .catch((err) => console.log(err))
      //
      //   return urls
      // })
    })

  })
}

// const lastMessage = (channel) => {
//   query('SELECT ts FROM link_messages WHERE channel=$1 ORDER BY ts DESC LIMIT 1',
//     [channel])
//     .then((result) => console.log(result[0][0]))
//     .catch((err) => console.log(err))
// }

module.exports = {
  getHistory,
  // lastMessage,
}
