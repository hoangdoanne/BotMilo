module.exports.config = {
  name: "draw", // Tên lệnh, được sử dụng trong việc gọi lệnh
  version: "1.0.0", // phiên bản của module này
  hasPermssion: 0, // Quyền hạn sử dụng, với 0 là toàn bộ thành viên, 1 là quản trị viên trở lên, 2 là admin/owner
  credits: "DungUwU", // Công nhận module sở hữu là ai
  description: "viết chữ", // Thông tin chi tiết về lệnh
  commandCategory: "general", // Thuộc vào nhóm nào: system, other, game-sp, game-mp, random-img, edit-img, media, economy, ...
  usages: "[text]", // Cách sử dụng lệnh
  cooldowns: 5,
  dependencies: {
    "canvas": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const fs = require("fs");
  const { createCanvas, loadImage, registerFont } = require('canvas');

  const pathImg = __dirname + '/cache/draw.png';
  let draw = () => new Promise(async (resolve) => {
    try {
      registerFont(__dirname + "/cache/bold-font.ttf", { family: 'Unicode' });
      const canvas = createCanvas(1000, 1000);
      const ctx = canvas.getContext("2d");
      const pic = await loadImage('https://i.ibb.co/wL60B7L/Lovepik-com-401419655-girl-holding-sign.png').catch(err => console.log('oh no!', err));

      ctx.drawImage(pic, 0, 0, canvas.width, canvas.height);
      ctx.font = `50px "Unicode"`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(args.join(" ") || "HELLO WORLD", 500, 230);
      
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return resolve();
    } catch(e) {
      console.log(e);
    }
  })
  await draw();
  api.sendMessage({
    body: "",
    attachment: fs.createReadStream(pathImg)
  }, event.threadID);
}