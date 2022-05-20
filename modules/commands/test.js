module.exports.config = {
	name: "test",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "DinhPhuc",
	description: "Kiểm tra mạng của bot",
	commandCategory: "system",
	usages: "test",
	cooldowns: 5
};

module.exports.run = async ({ api, event, client }) => {
	
	const timeStart = Date.now();
	return api.sendMessage("Ping Ping...", event.threadID, () => api.sendMessage(`Ok...Ping: ${Date.now() - timeStart}ms`, event.threadID, event.messageID));
}
