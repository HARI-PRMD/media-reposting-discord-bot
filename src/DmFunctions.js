const followerDMs = [];

function HandleDmMessages(message) {
  switch (message.content) {
    case "meow help":
      return message.reply(
        `use \`meow add me\` to receive memes, \`meow remove me\` to stop receiving memes.`
      );
    case "meow add me":
      return AddFollowerDm(message.channelId, message);
    case "meow remove me":
      return RemoveFollowerDm(message.channelId, message);
  }
}
function AddFollowerDm(userId, message) {
  if (followerDMs.includes(userId.toString()))
    return message.reply("Failed to add you to follower list");
  console.log("added id: " + userId);
  followerDMs.push(userId.toString());
  return message.reply("Added you to follower list.");
}

function RemoveFollowerDm(userId, message) {
  if (!followerDMs.includes(userId))
    return message.reply("Failed to remove you from follower list");
  for (let i = 0; i < followerDMs.length; i++) {
    if (followerDMs[i] == userId) {
      followerDMs.splice(i);
      console.log("removed id: " + userId);
      return message.reply("Removed you from follower list.");
    }
  }
  return message.reply("Failed to remove you from follower list");
}

function SendAllDms(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  for (const id of followerDMs) {
    const user = client.users.cache.get(id);
    if (user !== undefined) user.send(ImageUrl);
  }
  return true;
}

module.exports = {
  HandleDmMessages,
  SendAllDms,
};
