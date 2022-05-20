module.exports.config = {
	name: "bot",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "DinhPhuc",
	description: "Hướng dẫn người mới 😏",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, client }) => {

	return api.sendMessage(`[ Bot MiLo ❤ ]\n» ⚠️ Hãy sử dụng\n» ${global.config.PREFIX}help\n» Để hiển thị các lệnh được dùng trên bot này UwU ❤.`, event.threadID, event.messageID);
}
