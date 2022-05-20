const axios = require('axios');
const fs = require("fs");
const request = require('request');
module.exports.config = {
    name: "ảnh",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "TruongMini",
    description: "Xem ảnh réply",
    commandCategory: "hình ảnh",
    cooldowns: 5,
}, 
  
module.exports.handleReply = async ({ api, event, handleReply }) => {
    const { threadID, messageID, body} = event
    const input = body.trim();
    var b;
    switch (input) {
        case "1":
            b = "girl";
            break;
        case "2":
            b = "trai";
            break;
        case "3":
            b = "nobra";
            break;
        case "4":
            b = "duu";
            break;
        case "5":
            b = "mong";
            break;
        case "6":
            b = "loli";
            break;
        case "7":
            b = "nude";
            break;
        case "8":
            b = "beoo";
            break;
        default:
            break;
    }
    const res = axios.get(`https://botviet.me/api/${b}`).then(res => {
        var callback = function () {
            api.sendMessage({
                attachment: fs.createReadStream(__dirname + '/cache/anh.jpg')
            }, threadID, () => fs.unlinkSync(__dirname + '/cache/anh.jpg'), messageID);
        };
        request(res.data.url).pipe(fs.createWriteStream(__dirname + '/cache/anh.jpg')).on("close", callback)
    })
    return api.unsendMessage(handleReply.messageID, err => (err) ? api.sendMessage(getText('error'), threadID, messageID) : '');
};

module.exports.run = async function({ event, api, args }) {
    const { threadID, messageID, body} = event
    var msg = "» Danh sách các ảnh hiện có\n\n» 1.Gái\n» 2.Trai\n» 3.Nobra\n» 4.Dú\n» 5.Mông\n» 6.Loli\n» 7.Nude\n» 8.Beo\n\n» Hãy reply tin nhắn này kèm stt ảnh bạn muốn xem."
    api.sendMessage(msg, event.threadID, ((api, args) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: args.messageID,
            author: event.senderID,
        })
    }), event.messageID)
}