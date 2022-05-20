module.exports.config = {
  name: "nude",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "DinhPhuc",
  description: "nude thôi",
  commandCategory: "Hình ảnh",
  usages: "",
  cooldowns: 5
};
module.exports.run = async ({ api, event }) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  axios.get('https://botviet.me/api/nude').then(res => {
  let anh = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
  let callback = function () {
          api.sendMessage({
            body: `Hãy để con cặc em được thanh thản 😢`,
            attachment: fs.createReadStream(__dirname + `/cache/tl.${anh}`)
          }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/tl.${anh}`), event.messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/tl.${anh}`)).on("close", callback);
      })
}