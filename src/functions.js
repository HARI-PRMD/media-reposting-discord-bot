const follower = [];

function addFollower(channelId) {
  if (follower.includes(channelId)) return false;

  follower.push(channelId);
  return true;
}

function removeFollower(channelId) {
  if (!follower.includes(channelId)) return false;
  for (let i = 0; i < follower.length; i++) {
    if (follower[i] == channelId) {
      follower.splice(i);
      return true;
    }
  }
  return true;
}

function SendAllChannels(CdnUrl) {
  return true;
}

module.exports = {
  addFollower,
  removeFollower,
};
