const { GetAllIds, AppendId, RemoveId } = require("./DataFunctions");

function HandleDmMessages(message) {
  switch (message.content) {
    case "meow help":
      return message.reply(
        `use \`meow add me\` to receive memes, \`meow remove me\` to stop receiving memes.`
      );
    case "meow add me":
      return AddFollowerDm(message.author.id, message);
    case "meow remove me":
      return RemoveFollowerDm(message.author.id, message);
  }
}

async function AddFollowerDm(userId, message) {
  if (!(await AppendId("dms", userId))) {
    return message.reply(
      "Failed to add: " +
        message.author.username +
        " already exists in follower list."
    );
  }
  return message.reply(
    "Successfully added: " + message.author.username + " to follower list."
  );
}

async function RemoveFollowerDm(userId, message) {
  if (!(await RemoveId("dms", userId))) {
    return message.reply(
      "Failed to remove: " +
        message.author.username +
        " does not exist in follower list."
    );
  }
  return message.reply(
    "Successfully removed: " + message.author.username + " from follower list."
  );
}

async function SendAllDms(ImageUrl, client) {
  if (ImageUrl == undefined) return false;
  const allDms = await GetAllIds("dms");
  for (const id of allDms) {
    const user = await client.users.cache.get(id.toString());
    if (user !== undefined) user.send(ImageUrl);
  }
  return true;
}

module.exports = {
  HandleDmMessages,
  SendAllDms,
};
