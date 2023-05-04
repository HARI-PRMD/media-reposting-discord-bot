# 🤖 Meme/Media Reposting Discord Bot

[![Lint & Formatting](https://github.com/HARI-PRMD/meme-sharing-discord-bot/actions/workflows/lint.yml/badge.svg)](https://github.com/HARI-PRMD/meme-sharing-discord-bot/actions/workflows/lint.yml)

This bot reposts media in the form of images across guild channels and user dms
depending on owner and user preferences.

## 🧐 Reposting Capabilities

Currently supported media:

- Image uploads (jpeg, png, gif, anything that embeds)
- Youtube video links
- Reddit video links
- Tenor gifs
- discord video attachment links
- video uploads

Media that is yet to be tested:

- reddit image links
- instagram / tik tok / facebook video links

## 🧑‍💻 How to use?

Run the following commands

```console
$ git clone git@github.com:HARI-PRMD/meme-sharing-discord-bot.git
$ cd meme-sharing-discord-bot/
```

Create a `.env` file with the following environment variables

```.env
TOKEN=insert_your_bot_token_here
HEAD_CHANNEL=insert_head_channel_id_from_which_you_want_memes_posted_everywhere
OWNER_ID=insert_your_user_id_here
CLIENT_ID=insert_your_bots_client_id_here
```

Then run the following command to start the bot server

```console
$ npm install
$ npm run build
$ npm run start
```

## ✨ Extra Notes

- `npm run start` will automatically create and initialize an sqlite3 database in `/data/discord.db` upon running for the first time.
- Data is persistent, delete `discord.db` file and run the program again if you wish to clear the data.
- Adjust `EMBED_LOAD_TIME` in `/src/index.js` depending on how long it takes for an embed to load / or based on performance. Default is 2 seconds.

## 💀 Troubleshooting

- if you encounter any issues while running `npm install` consider deleting `package-lock.json` and trying again, or upgrade your version of node and npm.

P.S Please star this repository if you found it helpful 😊.

Happy Meme Reposting 🥳
