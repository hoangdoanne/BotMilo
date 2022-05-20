module.exports.config = {
	name:"upt",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Random ảnh theo api - uptime",
	commandCategory: "system",
	cooldowns: 3
	
};
module.exports.run = async ({ api, event, args }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	const moment = require("moment-timezone");
	var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");

    var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");

    var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");

    var ngay = moment.tz("Asia/Ho_Chi_Minh").format("D");

    var thang = moment.tz("Asia/Ho_Chi_Minh").format("MM");

    var nam = moment.tz("Asia/Ho_Chi_Minh").format("YYYY");
    var d = new Date();
    var day = d.getDay()
if (day == 0) var day = "Chủ nhật"
else if (day == 1) var day = "Thứ 2"
else if (day == 2) var day = "Thứ 3"
else if (day == 3) var day = "Thứ 4"
else if (day == 4) var day = "Thứ 5"
else if (day == 5) var day = "Thứ 6"
else if (day == 6) var day = "Thứ 7"
else if (day == 7) var day = "Chủ nhật"
else return console.log(day)
const time = process.uptime(),
        days = Math.floor(time / (60 * 60 * 60)),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
		const timeStart = Date.now();
	axios.get('https://botviet.me/api/nobra').then(res => {
	let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
	let callback = function () {
					api.sendMessage({body: `Hôm nay là ${day} Ngày ${ngay} tháng ${thang} năm ${nam}.\nBây giờ là: ${gio} giờ ${phut} phút ${giay} giây\nTime Bot Online ${hours} : ${minutes} : ${seconds}.\n»Prefix: [ ${global.config.PREFIX} ]\n»Ping: ${Date.now() - timeStart}ms.`,
						attachment: fs.createReadStream(__dirname + `/cache/anh.${ext}`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/anh.${ext}`), event.messageID);
				};
				request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/anh.${ext}`)).on("close", callback);
})
}