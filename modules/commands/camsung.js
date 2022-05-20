module.exports.config = {
	name: "camsung",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "hoàng ",
	description: "camsung",
	commandCategory: "hình ảnh",
	usages: "hình ảnh",
	cooldowns: 5,
	dependencies: {
	  "fs-extra": "",
	  "axios": "",
	  "canvas" :"",
	  "jimp": "",
	  "node-superfetch": ""
	}
};

module.exports.circle = async (image) => {
	  const jimp = global.nodemodule['jimp'];
  	image = await jimp.read(image);
  	image.circle();
  	return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args, Users }) => {
try {
  const Canvas = global.nodemodule['canvas'];
  const request = global.nodemodule["node-superfetch"];
  const jimp = global.nodemodule["jimp"];
  const fs = global.nodemodule["fs-extra"];
  var path_camsung = __dirname+'/cache/camsung.png'; 
  var id = Object.keys(event.mentions)[0] || event.senderID;
  const canvas = Canvas.createCanvas(500, 670);
	const ctx = canvas.getContext('2d');
	const background = await Canvas.loadImage('https://i.imgur.com/6NZQr4t.jpg');
  
	var avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
	avatar = await this.circle(avatar.body);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(await Canvas.loadImage(avatar), 175, 270, 100, 100); // có thể bạn không biết số đầu là sang phải số 2 lên là nhỏ xuống là to số 3 vs 4 nên để giống nhau
	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(path_camsung,imageBuffer);
	 api.sendMessage({attachment: fs.createReadStream(path_camsung, {'highWaterMark': 128 * 1024}), body: "Sừng em dài phết 🙂"}, event.threadID, () => fs.unlinkSync(path_camsung), event.messageID);
}
catch(e) {api.sendMessage(e.stack, event.threadID )}
}
