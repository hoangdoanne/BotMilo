module.exports.config = {
    name:"tech",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "DungUwU",
    description: "Dạy sim cute nói chiện :3",
    commandCategory: "General",
    usages: "câu muốn hỏi sim => câu muốn sim trả lời",
    cooldowns: 5
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
    let { messageID, threadID } = event;
    let work = args.join(" ");
    let fw = work.indexOf(" => ");
    if (fw == -1) {
        api.sendMessage("Sai format r nha dmm;-;",threadID,messageID);
    } else {
        let ask = work.slice(0, fw);
        let ans = work.slice(fw + 4, work.length);
        if (ask=="") {api.sendMessage("Thiếu câu hỏi kìa;-;",threadID,messageID)} else {
            if (!ans) {api.sendMessage("Thiếu câu trả lời kìa;-;",threadID,messageID)} else {
                    axios.get(encodeURI(`http://sim.botviet.me/simsimi/teach?ask=${ask}&ans=${ans}`)).then(res => {
                        if (res.data.message == "Câu hỏi với Câu trả lởi có hết cmnr, thêm cái cc;-;"){
                            api.sendMessage("Câu hỏi, Trả lời này có rồi ;-;",threadID,messageID)} else {
                                if (res.data.message == "Bị lỗi cc gì đó đéo biết nữa") {api.sendMessage('Lỗi không xác dịnh;-;',threadID,messageID)} else {
                                    api.sendMessage("done ;-;",threadID,messageID);
                                }
                            }
                    })
            }
        }
    }
}