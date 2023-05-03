import { Channel, Client, Message, TextChannel } from "discord.js";
import { RemoveId, AppendId, GetAllIds } from "./DataFunctions";

export const HandleChannelMessages = (
  message: Message & { channel: TextChannel }
) => {
  switch (message.content) {
    case "meow help":
      return message.reply(
        `use \`meow add this\` to receive memes, \`meow remove this\` to stop receiving memes.`
      );
    case "meow add this":
      return AddFollowerChannel(message.channelId, message);
    case "meow remove this":
      return RemoveFollowerChannel(message.channelId, message);
  }
};

const AddFollowerChannel = async (
  channelId: string,
  message: Message & { channel: TextChannel }
) => {
  if (!(await AppendId("channels", channelId))) {
    return message.reply(
      "Failed to add: Channel already exists in follower list."
    );
  }
  return message.reply(
    "Successfully added: #" + message.channel.name + " to follower list."
  );
};

const RemoveFollowerChannel = async (
  channelId: string,
  message: Message & { channel: TextChannel }
) => {
  if (!(await RemoveId("channels", channelId))) {
    return message.reply(
      "Failed to remove: This channel does not already exist in follower list."
    );
  }
  return message.reply(
    "Successfully removed #" + message.channel.name + " from follower list."
  );
};

export async function SendAllChannels(
  ImageUrl: string | undefined,
  client: Client
) {
  if (ImageUrl == undefined) return;
  const allChannels = await GetAllIds("channels");
  for (const id of allChannels) {
    const channel: Channel | undefined = client.channels.cache.get(id);
    if (channel !== undefined) (channel as TextChannel).send(ImageUrl);
  }
}
