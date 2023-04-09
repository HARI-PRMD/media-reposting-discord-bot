const { GetAllIds, AppendId, RemoveId } = require("./DataFunctions");

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
  if (!AppendId("dms", userId)) {
    return message.reply("error occurred while adding dm to follower list");
  }
  console.log("added id: " + userId);
  return message.reply("Added you to follower list.");
}

function RemoveFollowerDm(userId, message) {
  if (!RemoveId("dms", userId)) {
    return message.reply("error occurred while removing dm from follower list");
  }
  return message.reply("Removed you from follower list.");
}

async function SendAllDms(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  const allDms = await GetAllIds("dms");
  for (const id of allDms) {
    const user = client.users.cache.get(id);
    if (user !== undefined) user.send(ImageUrl);
  }
  return true;
}

module.exports = {
  HandleDmMessages,
  SendAllDms,
};
