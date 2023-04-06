const { GetAllIds, GetDb, AppendId, RemoveId } = require("./DataFunctions");

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

async function AddFollowerDm(userId, message) {
  const db = await GetDb();
  await AppendId(db, "dms", userId);
  console.log("added id: " + userId);
  return message.reply("Added you to follower list.");
}

async function RemoveFollowerDm(userId, message) {
  const db = await GetDb();
  await RemoveId(db, "dms", userId);
  return message.reply("Removed you from follower list.");
}

async function SendAllDms(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  const db = await GetDb();
  const allDms = await GetAllIds(db, "dms");
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
