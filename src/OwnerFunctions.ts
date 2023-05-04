import { Client, Message } from "discord.js";
import { SendAllChannels } from "./ChannelFunctions";
import { SendAllDms } from "./DmFunctions";

export const HandleNewMeme = (message: Message, client: Client) => {
  // send embedded image or gif or any other embedded media link
  if (message.embeds.length > 0) {
    SendAllChannels(message.embeds[0].data.url, client);
    SendAllDms(message.embeds[0].data.url, client);
  }
  // send uploaded image or video link
  if (message.attachments.size > 0) {
    message.attachments.forEach(function (attachment) {
      SendAllChannels(attachment.url, client);
      SendAllDms(attachment.url, client);
    });
  }
};

export const CheckForValidVariables = (
  TOKEN: string | undefined,
  CLIENT_ID: string | undefined,
  HEAD_CHANNEL: string | undefined,
  OWNER_ID: string | undefined
) => {
  if (!TOKEN) {
    throw new Error("Missing TOKEN environment variable.");
  }
  if (!CLIENT_ID) {
    throw new Error("Missing TOKEN environment variable.");
  }
  if (!HEAD_CHANNEL) {
    throw new Error("Missing TOKEN environment variable.");
  }
  if (!OWNER_ID) {
    throw new Error("Missing TOKEN environment variable.");
  }
};
