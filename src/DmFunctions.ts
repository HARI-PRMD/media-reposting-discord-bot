import { Client, DMChannel, Message, User } from "discord.js";
import { GetAllIds, AppendId, RemoveId } from "./DataFunctions";

export const HandleDmMessages = (message: Message & { channel: DMChannel }) => {
  switch (message.content) {
    case "meow help":
      return message.reply(
        `use \`meow add me\` to receive memes, \`meow remove me\` to stop receiving memes.`
      );
    case "meow add me":
      return AddFollowerDm(message.author.id as string, message);
    case "meow remove me":
      return RemoveFollowerDm(message.author.id as string, message);
  }
};

export const AddFollowerDm = async (
  userId: string,
  message: Message & { channel: DMChannel }
) => {
  if (!(await AppendId("dms", userId))) {
    return message.reply(
      "Failed to add " +
        "`" +
        message.author.username +
        "#" +
        message.author.discriminator +
        "`" +
        " already exists in follower list."
    );
  }
  return message.reply(
    "Successfully added " +
      "`" +
      message.author.username +
      "#" +
      message.author.discriminator +
      "`" +
      " to follower list."
  );
};

export const RemoveFollowerDm = async (
  userId: string,
  message: Message & { channel: DMChannel }
) => {
  if (!(await RemoveId("dms", userId))) {
    return message.reply(
      "Failed to remove: " +
        "`" +
        message.author.username +
        "#" +
        message.author.discriminator +
        "`" +
        " does not exist in follower list."
    );
  }
  return message.reply(
    "Successfully removed " +
      "`" +
      message.author.username +
      "#" +
      message.author.discriminator +
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
