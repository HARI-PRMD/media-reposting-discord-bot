const followerChannels = [];

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

function AddFollowerChannel(channelId, message) {
  if (followerChannels.includes(channelId.toString()))
    return message.reply("Failed to add channel to follower list");
  console.log("added id: " + channelId);
  followerChannels.push(channelId.toString());
  return message.reply("Added " + message.channel.name + " to follower list.");
}

function RemoveFollowerChannel(channelId, message) {
  if (!followerChannels.includes(channelId))
    return message.reply("Failed to remove channel from follower list");
  for (let i = 0; i < followerChannels.length; i++) {
    if (followerChannels[i] == channelId) {
      followerChannels.splice(i);
      console.log("removed id: " + channelId);
      return message.reply(
        "Removed " + message.channel.name + " from follower list."
      );
    }
  }
  return message.reply("Failed to remove channel from follower list");
}

function SendAllChannels(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  for (const id of followerChannels) {
    const channel = client.channels.cache.get(id);
    if (channel !== undefined) channel.send(ImageUrl);
  }
  return true;
}

module.exports = {
  HandleChannelMessages,
  SendAllChannels,
};
