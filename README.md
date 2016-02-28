# Slack Link Archiver

Install dependencies with `npm install`

Setup database `npm run reset`

Create a `.env` file in the root directory with your slack token and channel:

```
SLACK_TOKEN=XXXXXXXX
SLACK_CHANNEL=C0470JR5N
```

Run server `npm start`

Visit `http://localhost:7777/` to view links!

Note: Requires PostgreSQL and Redis
