# Slack Link Archiver

Install dependencies with `npm install`

Setup database `npm run reset`

Create a `.env` file in the root directory with your slack token and channel:

```
SLACK_TOKEN=XXXXXXXX
SLACK_CHANNEL=C0470JR5N
```

Run server `npm start`

## Routes:

- `http://localhost:7777/` to view links
- `http://localhost:7777/reset` to clear the last fetch time
- `http://localhost:7777/links` to force a fetch and view data as json


Note: Requires PostgreSQL and Redis
