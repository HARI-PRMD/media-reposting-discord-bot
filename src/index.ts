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
import { HandleNewMeme } from "./OwnerFunctions";
import { InitTables } from "./DataFunctions";

// SOME CONSTANTS
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const HEAD_CHANNEL = process.env.HEAD_CHANNEL?.toString();
const OWNER_ID = process.env.OWNER_ID?.toString();
const EMBED_LOAD_TIME = 2000; // in milliseconds

const rest = new REST({ version: "9" }).setToken(
  "MTA5Mjk4OTEwMjQ4NTQxMzg5OQ.GHRj8D.kL-GeHsv-paCZd1s-YnyYb5RZQfHH7vFJ1JHhI"
);

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
    name: "add",
    description: "Start receiving memes in this channel!",
  },
  {
    name: "remove",
    description: "Stop receiving memes in this channel!",
  },
  {
    name: "info",
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
    if (interaction.commandName === "add") {
      AddFollowerChannel(
        interaction.channelId as string,
        interaction as CommandInteraction & { channel: TextChannel }
      );
    }
    if (interaction.commandName === "remove") {
      RemoveFollowerChannel(
        interaction.channelId as string,
        interaction as CommandInteraction & { channel: TextChannel }
      );
    }
  }
  if (interaction.channel instanceof DMChannel) {
    if (interaction.commandName === "add") {
      AddFollowerDm(
        interaction.user.id as string,
        interaction as CommandInteraction & { channel: DMChannel }
      );
    }
    if (interaction.commandName === "remove") {
      RemoveFollowerDm(
        interaction.user.id as string,
        interaction as CommandInteraction & { channel: DMChannel }
      );
    }
  }
  // do the same for dms
  // if (interaction.commandName === "add") {
  //   AddFollowerChannel(interaction.channelId as string, interaction);
  //   await interaction.reply("adding channel");
  // }
  // if (interaction.commandName === "remove") {
  //   await interaction.reply("removing channel");
  // }
  if (interaction.commandName === "info") {
    await interaction.reply("getting info");
  }
});

// Log in to Discord with your client's token
client.login(TOKEN);
