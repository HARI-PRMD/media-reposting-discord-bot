const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const { addFollower } = require("./functions");

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
  if (message.content == "hi") return message.reply("hi");
  if (message.channelId == "1092987636035092662") {
    try {
      // now send this to everyone
      const url = message.attachments.map((a) => a.url).toString();
    } catch {
      console.log("failed to get url");
    }
    // SendAllChannels()
  }

  switch (message.content) {
    case "meow help":
      return message.reply(
        `use \`meow add this\` to receive memes, \`meow remove this\` to stop receiving memes.`
      );
    case "meow add this":
      return addFollower(message.channelId)
        ? message.reply("Added ", message.channel.name, " to follower list.")
        : message.reply("Failed to add channel to follower list");
    case "meow remove this":
      return removeFollower(message.channelId)
        ? message.reply(
            "Removed ",
            message.channel.name,
            " from follower list."
          )
        : message.reply("Failed to remove channel from follower list");
  }
});
