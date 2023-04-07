const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const { HandleChannelMessages } = require("./ChannelFunctions");
const { HandleDmMessages } = require("./DmFunctions");
const { HandleNewMeme } = require("./OwnerFunctions");
const { database, InitTables } = require("./DataFunctions");

// SOME CONSTANTS
const HEAD_CHANNEL = process.env.HEAD_CHANNEL.toString();
const OWNER_ID = process.env.OWNER_ID.toString();
const CHANNEL_TYPE = 0;
const DM_TYPE = 1;
const EMBED_LOAD_TIME = 2000; // in milliseconds

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

async function initialize() {
  console.log(database);
  InitTables();
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  // initialize db and tables
  initialize();
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);

// do functions based on messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // dm functions are available to anyone
  if (message.channel.type == DM_TYPE) {
    HandleDmMessages(message);
  }
  // remaining functions need Authorization of Owner
  if (message.author.id !== OWNER_ID) return;
  if (message.channelId == HEAD_CHANNEL) {
    // needs time for the embed object to load in messages object
    setTimeout(() => {
      return HandleNewMeme(message, client);
    }, EMBED_LOAD_TIME);
  }
  if (message.channel.type == CHANNEL_TYPE) {
    return HandleChannelMessages(message);
  }
});
