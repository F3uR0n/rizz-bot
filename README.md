# Rizz Bot

Rizz Bot is a Discord bot that tracks chat activity, awards rizz levels, and provides troll interactions with optional image roasts. It uses slash commands and message events to deliver stats and light-hearted trolling within a server.

## Features

- Rizz tracking per user with level titles
- Slash commands for rizz checks and leaderboard
- Troll command with backfire logic and optional images
- Random troll events based on message activity

## Project Structure

```
.
├── commands/
│   ├── rizz.js
│   └── troll.js
├── data/
│   ├── personalRoasts.js
│   └── rizz.json
├── events/
│   ├── messageCreate.js
│   └── ready.js
├── handlers/
│   ├── rizz.js
│   └── trollEngine.js
├── images/
├── config.js
├── index.js
├── package.json
└── README.md
```

## Requirements

- Node.js 18+ (recommended)
- A Discord application and bot token

## Setup

1. Install dependencies:
	```bash
	npm install
	```
2. Create a `.env` file in the project root:
	```env
	DISCORD_TOKEN=your_bot_token
	OWNER_ID=your_discord_user_id
	```
3. (Optional) Add user images to `images/` using the user ID as the filename:
	- Single image: `USERID.jpg`
	- Multiple images: `USERID_1.jpg`, `USERID_2.png`, etc.

## Run

- Development (auto-reload):
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

## Technologies Used

- Node.js
- discord.js
- dotenv
- nodemon (dev)

## Notes

- Slash commands are registered on startup using global registration.
- Rizz data is stored locally in `data/rizz.json`.
