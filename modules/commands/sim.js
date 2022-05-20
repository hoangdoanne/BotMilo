module.exports.config = {
    name:"sim",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "DungUwU",
    description: "Nói chiện zới sim mất dậy nhất ;-;",
    commandCategory: "General",
    usages: "[câu hỏi]/[on,off]",
    cooldowns: 5
};

const axios = require('axios');

module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const log = require(process.cwd() + '/utils/log');
    const path = resolve(__dirname, 'cache', 'sim.json');
    if (!existsSync(path)) {
        const obj = {
            sim: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('sim')) data.sim = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}

module.exports.handleEvent = async ({ api, event, args, Threads }) => {
    const { threadID, messageID } = event;
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '../commands', 'cache', 'sim.json');
    const { sim } = require(path);

    if (sim.hasOwnProperty(threadID) && sim[threadID] == true) {
      if (event.senderID !== api.getCurrentUserID()) {
      axios.get(encodeURI(`http://sim.botviet.me/simsimi?ask=${event.body}`)).then(res => {
            if (res.data.answer == "null" || res.data.answer == "Tao ko hiểu m nói cc j ;-;") {
                api.sendMessage("Mày nói cc j z?, Dạy lại đi;-;",threadID,messageID)
            } else {
                return api.sendMessage(res.data.answer, threadID, messageID);
            }
    })
    }  
    }
}

module.exports.run = async ({ api, event, args, Threads }) => {
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, 'cache', 'sim.json');
    const { threadID, messageID } = event;
    const database = require(path);
    const { sim } = database;

    if (!args[0]) { api.sendMessage("Clmm! Hỏi gì hỏi mẹ đi;-;", threadID, messageID) } else {
        switch(args[0]) {
            case "on": {
                sim[threadID] = true;
                api.sendMessage("Bật sim thành công!", threadID, messageID);
                break;
            }
            case "off": {
                sim[threadID] = false;
                api.sendMessage("Đã tắt sim thành công!", threadID, messageID);
                break;
            }
            default:
            axios.get(encodeURI(`http://sim.botviet.me/simsimi?ask=${args.join(" ")}`)).then(res => {
            if (res.data.answer == "null" || res.data.answer == "Tao ko hiểu m nói cc j ;-;") {
                api.sendMessage("Mày nói cc jz?, Dạy lại đi;-;",threadID,messageID)
            } else {
                return api.sendMessage(res.data.answer, threadID, messageID);
            }
            });
            break;
        }
        writeFileSync(path, JSON.stringify(database, null, 4));
    }
}