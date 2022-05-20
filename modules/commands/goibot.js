 const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "....",
  description: "goibot",
  commandCategory: "other",
  usages: "",
  cooldowns: 5,
};
module.exports.handleEvent = function({ api, event, args, Threads }) {
  var { threadID, messageID, reason } = event;
  
  if ((event.body.toLowerCase() == "bot out")) {
    return api.sendMessage("Tạm biệt mng ><", threadID, () =>
      api.removeUserFromGroup(api.getCurrentUserID(), threadID));
  };

  if ((event.body.toLowerCase() == "Kick 1 bot ra đi")) {
    return api.sendMessage("Cút, tao tự ra", threadID, () =>
      api.removeUserFromGroup(api.getCurrentUserID(), threadID));
  };

  if ((event.body.toLowerCase() == "kick bot")) {
    return api.sendMessage("Kick cái địt mẹ mày, tao tự out", threadID, () =>
      api.removeUserFromGroup(api.getCurrentUserID(), threadID));
  };

  if ((event.body.toLowerCase() == "vote kick bot")) {
    return api.sendMessage("vote con cặc", threadID, () =>
      api.removeUserFromGroup(api.getCurrentUserID(), threadID));
  };
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }