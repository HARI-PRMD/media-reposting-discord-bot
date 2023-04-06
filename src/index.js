const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const { HandleChannelMessages } = require("./ChannelFunctions");
const { HandleDmMessages } = require("./DmFunctions");
const { HandleNewMeme } = require("./OwnerFunctions");
const {
  GetDb,
  InitTables,
  AppendId,
  RemoveId,
  GetAllIds,
  CloseDb,
} = require("./DataFunctions");

// SOME CONSTANTS
const HEAD_CHANNEL = process.env.HEAD_CHANNEL.toString();
const OWNER_ID = process.env.OWNER_ID.toString();
const CHANNEL_TYPE = 0;
const DM_TYPE = 1;

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
  // initialize db and tables
  InitTables(GetDb());
  console.log(`Initialized Db`);

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
    return HandleNewMeme(message, client);
  }
  if (message.channel.type == CHANNEL_TYPE) {
    return HandleChannelMessages(message);
  }
});
