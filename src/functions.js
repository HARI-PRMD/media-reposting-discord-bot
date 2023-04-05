const follower = [];

function AddFollower(channelId) {
  if (follower.includes(channelId.toString())) return false;
  console.log("added id: " + channelId);
  follower.push(channelId.toString());
  return true;
}

function RemoveFollower(channelId) {
  if (!follower.includes(channelId)) return false;
  for (let i = 0; i < follower.length; i++) {
    if (follower[i] == channelId) {
      follower.splice(i);
      return true;
    }
  }
  console.log("removed id: " + channelId);
  return true;
}

async function SendAllChannels(ImageUrl, client) {
  if ((ImageUrl = undefined)) return false;
  for (const id in follower) {
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
