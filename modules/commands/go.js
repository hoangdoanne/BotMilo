module.exports.config = {
	name: "gỡ",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Gỡ tin nhắn của Bot",
	commandCategory: "System", 
	usages: "gỡ", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = function({ api, event, args }) {
  try{
  //if (event.type == "message_reply") return api.sendMessage('Hãy reply tin nhắn cần gỡ.', event.threadID, event.messageID);
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage('Không thể gỡ tin nhắn của người khác.', event.threadID, event.messageID);

	return api.unsendMessage(event.messageReply.messageID);
} catch(err) {
    return api.sendMessage('Hãy reply tin nhắn cần gỡ.', event.threadID, event.messageID);
}
}