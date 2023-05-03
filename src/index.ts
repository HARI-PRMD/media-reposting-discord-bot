import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  Message,
  DMChannel,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import { HandleChannelMessages } from "./ChannelFunctions";
import { HandleDmMessages } from "./DmFunctions";
import { HandleNewMeme } from "./OwnerFunctions";
import { database, InitTables } from "./DataFunctions";

// SOME CONSTANTS
const HEAD_CHANNEL = process.env.HEAD_CHANNEL?.toString();
const OWNER_ID = process.env.OWNER_ID?.toString();
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
client.once(Events.ClientReady, async (c: Client) => {
  // initialize db and tables
  initialize();
  console.log(`Ready! Logged in as ${c.user?.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);

// do functions based on messages
client.on("messageCreate", async (message: Message): Promise<any> => {
  if (message.author.bot) return;
  // dm functions are available to anyone
  if (message.channel instanceof DMChannel) {
    HandleDmMessages(message as Message & { channel: DMChannel });
  }
  // remaining functions need Authorization of Owner
  if (message.author.id !== OWNER_ID) return;
  if (message.channelId == HEAD_CHANNEL) {
    // needs time for the embed object to load in messages object
    setTimeout(() => {
      return HandleNewMeme(message, client);
    }, EMBED_LOAD_TIME);
  }
  if (message.channel instanceof TextChannel) {
    return HandleChannelMessages(message as Message & { channel: TextChannel });
  }
});
