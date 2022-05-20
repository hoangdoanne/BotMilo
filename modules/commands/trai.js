module.exports.config = {
	name: "trai",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "DinhPhuc",
	description: "Xem ảnh Trai",
	commandCategory: "Hình Ảnh",
	usages: "trai",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	axios.get('https://botviet.me/api/trai').then(res => {
	let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
	let callback = function () {
					api.sendMessage({
						body: `Trai của chị đây 😼`,
						attachment: fs.createReadStream(__dirname + `/cache/anh.${ext}`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/anh.${ext}`), event.messageID);
				};
				request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/anh.${ext}`)).on("close", callback);
})
}