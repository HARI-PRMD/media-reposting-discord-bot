const follower = [];

function AddFollower(channelId, message) {
  if (follower.includes(channelId.toString()))
    return message.reply("Failed to add channel to follower list");
  console.log("added id: " + channelId);
  follower.push(channelId.toString());
  return message.reply("Added " + message.channel.name + " to follower list.");
}

function RemoveFollower(channelId, message) {
  if (!follower.includes(channelId))
    return message.reply("Failed to remove channel from follower list");
  for (let i = 0; i < follower.length; i++) {
    if (follower[i] == channelId) {
      follower.splice(i);
      console.log("removed id: " + channelId);
      return message.reply(
        "Removed " + message.channel.name + " from follower list."
      );
    }
  }
  return message.reply("Failed to remove channel from follower list");
}

function SendAllChannels(ImageUrl, client) {
  if ((ImageUrl = undefined)) return false;
  for (const id of follower) {
    const channel = client.channels.cache.get(id);
    if (channel !== undefined) channel.send(ImageUrl);
  }
  return true;
}

module.exports = {
  follower,
  AddFollower,
  RemoveFollower,
  SendAllChannels,
};
