module.exports.config = {
	name: "dú",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "DinhPhuc",
	description: "Xem ảnh dú",
	commandCategory: "Hình Ảnh",
	usages: "dú",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	axios.get('https://mzkapi.me/images/du').then(res => {
        let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
  let callback = function () {
          api.sendMessage({
            body: `Xuốt ngày dú dú😼`,
            attachment: fs.createReadStream(__dirname + `/cache/anh.${ext}`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/anh.${ext}`), event.messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/anh.${ext}`)).on("close", callback);
})
}