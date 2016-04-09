# Slack Link Archiver
Fetch and store links that get shared in a given slack channel to revisit interesting content you may have missed.

## Requirements
- PostgreSQL
- Redis
- Node > 5.3.0

## Usage
Install dependencies with `npm install`

Setup database `npm run reset`

Generate a test token for your team at the [Slack API docs](https://api.slack.com/docs/oauth-test-tokens)

List your channels by making a GET request with your token: `https://slack.com/api/channels.list?pretty=1&token=YOUR_TOKEN`

Create a `.env` file in the root directory with your slack token and the channel ID to archive:

```
SLACK_TOKEN=XXXXXXXX
SLACK_CHANNEL=C0470JR5N
```
Note: this will not be committed to your repo

Run server with `npm start`

Visit http://localhost:7777 in your browser

## What's happening?

- On boot, server will fetch all history for your channel
- While fetching, messages with links are saved to postgres
- Every hour, new messages will be fetched
- The timestamp of each fetch is saved in Redis

## Routes:

- `http://localhost:7777/` to view links
- `http://localhost:7777/reset` to clear the last fetch time
- `http://localhost:7777/links` to force a fetch and view data as json
