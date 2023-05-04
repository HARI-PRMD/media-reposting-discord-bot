import { Client, CommandInteraction, DMChannel, User } from "discord.js";
import { GetAllIds, AppendId, RemoveId } from "./DataFunctions";

export const AddFollowerDm = async (
  userId: string,
  interaction: CommandInteraction & { channel: DMChannel }
) => {
  if (!(await AppendId("dms", userId))) {
    return interaction.reply(
      "Failed to add " +
        "`" +
        interaction.user.username +
        "#" +
        interaction.user.discriminator +
        "`" +
        " already exists in follower list."
    );
  }
  return interaction.reply(
    "Successfully added " +
      "`" +
      interaction.user.username +
      "#" +
      interaction.user.discriminator +
      "`" +
      " to follower list."
  );
};

export const RemoveFollowerDm = async (
  userId: string,
  interaction: CommandInteraction & { channel: DMChannel }
) => {
  if (!(await RemoveId("dms", userId))) {
    return interaction.reply(
      "Failed to remove: " +
        "`" +
        interaction.user.username +
        "#" +
        interaction.user.discriminator +
        "`" +
        " does not exist in follower list."
    );
  }
  return interaction.reply(
    "Successfully removed " +
      "`" +
      interaction.user.username +
      "#" +
      interaction.user.discriminator +
      "`" +
      " from follower list."
  );
};

export const SendAllDms = async (
  ImageUrl: string | undefined,
  client: Client
) => {
  if (ImageUrl === undefined) return;
  const allDms: string[] = await GetAllIds("dms");
  for (const id of allDms) {
    try {
      const user: User | undefined = await client.users.fetch(id as string);
      if (user === undefined) continue;
      const DMchannel: DMChannel | undefined = await user.createDM();
      if (DMChannel !== undefined) await DMchannel.send(ImageUrl);
    } catch (err) {
      console.log("Experienced error while sending media to " + id);
      console.log(err);
    }
  }
};
