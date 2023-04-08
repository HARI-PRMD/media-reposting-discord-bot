# 🤖 Meme/Media Reposting Discord Bot

This bot reposts media in the form of images across guild channels and user dms
depending on owner and user preferences.

## 🧐 Reposting Capabilities

Currently supported media:
- Image uploads (jpeg, png, gif, anything that embeds)
- Youtube video links
- Reddit video links
- Tenor gifs
- discord video attachment links

Media that is yet to be tested:
- video uploads
- reddit image links
- instagram / tik tok / facebook video links

## 🧑‍💻 How to use?

Run the following commands

```console
$ git clone git@github.com:HARI-PRMD/meme-sharing-discord-bot.git
$ cd meme-sharing-discord-bot
```

Create a `.env` file with the following environment variables

```.env
TOKEN=insert_your_bot_token_here
HEAD_CHANNEL=insert_head_channel_id_from_which_you_want_memes_posted_everywhere
OWNER_ID=insert_your_user_id_here
```

Then run the following command to start the bot server

```console
$ npm install
$ npm run start
```

## ✨ Extra Notes

- `npm run start` will automatically create and initialize an sqlite3 database in `/data/discord.db` upon running for the first time.
- Data is persistent, delete `discord.db` file and run the program again if you wish to refresh the data.
- Adjust `EMBED_LOAD_TIME` in `/src/index.js` depending on how long it takes for an embed to load / or based on performance. Default is 2 seconds.

P.S Please star this repository if you found it helpful 😊.

Happy Meme Reposting 🥳
