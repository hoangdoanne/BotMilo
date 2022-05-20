module.exports.config = {
  name: "tid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "VanHung",
  description: "Kiểm tra thông tin nhs chat.",
  commandCategory: "Other",
  usages: "tid",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
	const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  let threadInfo = await api.getThreadInfo(event.threadID);
  return api.sendMessage(`${threadInfo.threadID}`, event.threadID, event.messageID);
}