module.exports.config = {
    name: "thính",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Phúc",
    description: "...",
    commandCategory: "other",
    usages: " ",
    cooldowns: 5,
    
};
module.exports.run = async ({ api, event }) => {
const axios = require('axios');
const res = await axios.get(`https://dit.hongon3.repl.co/gif2`);
var thính = res.data.data
return api.sendMessage(` ${thính} `, event.threadID, event.messageID)
}