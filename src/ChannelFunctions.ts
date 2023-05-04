import { Channel, Client, CommandInteraction, TextChannel } from "discord.js";
import { RemoveId, AppendId, GetAllIds } from "./DataFunctions";

export const AddFollowerChannel = async (
  channelId: string,
  interaction: CommandInteraction & { channel: TextChannel }
) => {
  if (!(await AppendId("channels", channelId))) {
    return interaction.reply(
      "Failed to add: Channel already exists in follower list."
    );
  }
  return interaction.reply(
    "Successfully added: #" + interaction.channel.name + " to follower list."
  );
};

export const RemoveFollowerChannel = async (
  channelId: string,
  interaction: CommandInteraction & { channel: TextChannel }
) => {
  if (!(await RemoveId("channels", channelId))) {
    return interaction.reply(
      "Failed to remove: This channel does not already exist in follower list."
    );
  }
  return interaction.reply(
    "Successfully removed #" + interaction.channel.name + " from follower list."
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
