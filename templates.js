const moment = require('moment')
const linkify = (str) => {
  return str.replace(/<\S+>/gi, (slackLink) => {
    slackLink = slackLink.replace(/[<>]/g, '')
    const urlAnchor = slackLink.split('|')
    return `<a href='${urlAnchor[0]}'>${urlAnchor[1]}</a>`
  })
}

const Templates = function () {
  this.layout = (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Slack Links</title>
      <link href="https://npmcdn.com/basscss@8.0.0/css/basscss.min.css" rel="stylesheet">
      <style>
        body { font-family: Helvetica, Arial, "Lucida Grande", sans-serif; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `

  this.linkPage = (messages) => {
    const table = `
    <table class="">
      <thead>
        <tr>
          <th>Time</th>
          <th>Username</th>
          <th>Links</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${ messages.map((msg) => `
          <tr class="border-bottom">
            <td>${moment.unix(msg.ts).fromNow()}</td>
            <td>${msg.username}</td>
            <td>${msg.links.map((link) => linkify(link)).join('<br />')}</td>
            <td>${linkify(msg.message)}</td>
          </tr>
        `).join('') }
      </tbody>
    </table>
    `
    return this.layout(table)
  }
}


module.exports = new Templates()
