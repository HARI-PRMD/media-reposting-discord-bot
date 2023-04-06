const { RemoveId, AppendId, GetAllIds, GetDb } = require("./DataFunctions");

function HandleChannelMessages(message) {
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
}

async function AddFollowerChannel(channelId, message) {
  let db = await GetDb();
  await AppendId(db, "channels", channelId);
  return message.reply("Added #" + message.channel.name + " to follower list.");
}

async function RemoveFollowerChannel(channelId, message) {
  let db = await GetDb();
  await RemoveId(db, "channels", channelId);
  return message.reply(
    "Removed #" + message.channel.name + " from follower list."
  );
}

async function SendAllChannels(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  const db = await GetDb();
  const allChannels = await GetAllIds(db, "channels");

  for (const id of allChannels) {
    const channel = client.channels.cache.get(id);
    if (channel !== undefined) channel.send(ImageUrl);
  }
  return true;
}

module.exports = {
  HandleChannelMessages,
  SendAllChannels,
};
