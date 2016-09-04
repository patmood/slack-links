// like npm run, but without npm
// e.g.
//   $ node run history

'use strict'

module.exports.history = () => {
  let oldestTs
  require("dotenv").load()
  require("./slack")
    .allHistoryStream2({
      token: process.env.SLACK_TOKEN,
      channel: process.env.SLACK_CHANNEL,
      count: 100,
    })
    .on("data", (m) => console.log(m.ts, m.text))
    .on("end", () => console.log("done"))
}

if (require.main === module) module.exports[process.argv[2]]()
