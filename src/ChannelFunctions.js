const { RemoveId, AppendId, GetAllIds } = require("./DataFunctions");

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
  if (!(await AppendId("channels", channelId))) {
    return message.reply(
      "Failed to add: Channel already exists in follower list."
    );
  }
  return message.reply(
    "Successfully added: #" + message.channel.name + " to follower list."
  );
}

async function RemoveFollowerChannel(channelId, message) {
  if (!(await RemoveId("channels", channelId))) {
    return message.reply(
      "Failed to remove: This channel does not already exist in follower list."
    );
  }
  return message.reply(
    "Successfully removed #" + message.channel.name + " from follower list."
  );
}

async function SendAllChannels(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  const allChannels = await GetAllIds("channels");
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
