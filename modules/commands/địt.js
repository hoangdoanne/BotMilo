const request = require('request');
const fs = require('fs')
module.exports.config = {
    name: "địt",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hoàng 🥀",
    description: "địt người bạn tag",
    commandCategory: "general",
    usages: "[tag người bạn cần địt]",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async ({ api, event, args, Users }) => {
    const { threadID, messageID, senderID } = event;
    var out = (msg) => api.sendMessage(msg, threadID, messageID);
    if (!args.join(" ")) return out("Bạn phải tag 1 người");
    let nameUser = await Users.getNameUser(senderID);
    console.log(nameUser);
    return request('https://api.hongon3.repl.co/dit', (err, response, body) => {
        let picData = JSON.parse(body);
        var mention = Object.keys(event.mentions)[0];
        let getURL = picData.url;
        let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
        let tag = event.mentions[mention].replace("@", "");
        let callback = function() {
        api.sendMessage({
            body: `${tag} Bị ${nameUser} Địt Sướng Không Em 🥀 ` ,
            mentions: [
                {
                    tag: nameUser,
                    id: senderID
                },
                {
                    tag: tag,
                    id: Object.keys(event.mentions)[0]
                }
            ],
            attachment: fs.createReadStream(__dirname + `/cache/anime.${ext}`)
        }, threadID, () => fs.unlinkSync(__dirname + `/cache/anime.${ext}`), messageID);
        };
        request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/anime.${ext}`)).on("close", callback);
    });
}