const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const {
  follower,
  AddFollower,
  RemoveFollower,
  SendAllChannels,
} = require("./functions");

// SOME CONSTANTS
const HEAD_CHANNEL = process.env.HEAD_CHANNEL.toString();
const OWNER_ID = process.env.OWNER_ID.toString();

// Create a new client instance
const client = new Client({
  partials: [Partials.Channel, Partials.User, Partials.Message],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);

// do functions based on messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.author.id !== OWNER_ID) return;
  if (message.channelId == HEAD_CHANNEL) {
    if (message.attachments.size > 0) {
      message.attachments.forEach(async function (attachment) {
        SendAllChannels(attachment.url, client);
      });
    }
  }
  switch (message.content) {
    case "meow help":
      return message.reply(
        `use \`meow add this\` to receive memes, \`meow remove this\` to stop receiving memes.`
      );
    case "meow add this":
      return AddFollower(message.channelId, message);
    case "meow remove this":
      return RemoveFollower(message.channelId, message);
  }
});
