const { SendAllChannels } = require("./ChannelFunctions");
const { SendAllDms } = require("./DmFunctions");

function HandleNewMeme(message, client) {
  if (message.attachments.size > 0) {
    message.attachments.forEach(function (attachment) {
      SendAllChannels(attachment.url, client);
      SendAllDms(attachment.url, client);
    });
  }
}

module.exports = {
  HandleNewMeme,
};
