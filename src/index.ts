import {
  Client,
  GatewayIntentBits,
  Partials,
  Message,
  DMChannel,
  TextChannel,
  Interaction,
  REST,
  Routes,
  CommandInteraction,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import { AddFollowerChannel, RemoveFollowerChannel } from "./ChannelFunctions";
import { AddFollowerDm, RemoveFollowerDm } from "./DmFunctions";
import { CheckForValidVariables, HandleNewMeme } from "./OwnerFunctions";
import { InitTables } from "./DataFunctions";

// SOME CONSTANTS
const TOKEN = process.env?.TOKEN;
const CLIENT_ID = process.env?.CLIENT_ID;
const HEAD_CHANNEL = process.env.HEAD_CHANNEL?.toString();
const OWNER_ID = process.env.OWNER_ID?.toString();
const EMBED_LOAD_TIME = 2000; // in milliseconds

CheckForValidVariables(TOKEN, CLIENT_ID, HEAD_CHANNEL, OWNER_ID);
if (!TOKEN) throw new Error("Missing TOKEN environment variable.");
const rest = new REST({ version: "9" }).setToken(TOKEN);

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

const commands = [
  {
    name: "follow",
    description: "Start receiving memes in this channel!",
  },
  {
    name: "unfollow",
    description: "Stop receiving memes in this channel!",
  },
  {
    name: "about",
    description: "What does this bot do?",
  },
];

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on("ready", async () => {
  InitTables();
  console.log(`Logged in as ${client.user?.tag}!`);
  try {
    console.log("Started refreshing application (/) commands.");

    if (CLIENT_ID)
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

// Takes all media input from head channel
client.on("messageCreate", async (message: Message): Promise<any> => {
  if (message.author.bot) return;
  // media can only be sent by the owner
  if (message.author.id !== OWNER_ID) return;
  if (message.channelId == HEAD_CHANNEL) {
    // waits for embed to load to get its url
    setTimeout(() => {
      return HandleNewMeme(message, client);
    }, EMBED_LOAD_TIME);
  }
});

// commands used by users who want to follow or un-follow posts
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.channel instanceof TextChannel) {
    if (interaction.commandName === "follow") {
      AddFollowerChannel(
        interaction.channelId as string,
        interaction as CommandInteraction & { channel: TextChannel }
      );
    }
    if (interaction.commandName === "unfollow") {
      RemoveFollowerChannel(
        interaction.channelId as string,
        interaction as CommandInteraction & { channel: TextChannel }
      );
    }
  }
  if (interaction.channel instanceof DMChannel) {
    if (interaction.commandName === "follow") {
      AddFollowerDm(
        interaction.user.id as string,
        interaction as CommandInteraction & { channel: DMChannel }
      );
    }
    if (interaction.commandName === "unfollow") {
      RemoveFollowerDm(
        interaction.user.id as string,
        interaction as CommandInteraction & { channel: DMChannel }
      );
    }
  }
  if (interaction.commandName === "about") {
    await interaction.reply(
      "I am a meme re-posting bot developed by `Hehe#6969` for re-posting his memes to channels and following user's dms! Add me to any server and type `/follow` to start receiving memes in that channel, or type the same in a dm to have memes dm-ed to you 🤖.\nSubmit Feature requests here: https://github.com/HARI-PRMD/meme-sharing-discord-bot/issues ✨."
    );
  }
});

// Log in to Discord with your client's token
client.login(TOKEN);
