module.exports.config = {
    name: "taixiu",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie ",
    description: "Chơi tài xỉu",
    commandCategory: "game",
    usages: "[tài/xỉu]",
    cooldowns: 15
};
module.exports.run = async function ({ api, event, args, Currencies, Users }) {
    const { senderID, messageID, threadID } = event;
    const axios = require('axios');
    const fs = require("fs-extra");
    const dataMoney = await Currencies.getData(senderID);
    const moneyUser = dataMoney.money;
    if (!args[0]) return api.sendMessage("⚠️ Bạn phải cược tài hoặc xỉu...", threadID, messageID);
    const choose = args[0]
    if (choose.toLowerCase() != 'tài' && choose.toLowerCase() != 'xỉu') return api.sendMessage("⚠️ Chỉ đặt cược tài hoặc xỉu!", threadID, messageID)
    const money = args[1]
    if (money < 50 || isNaN(money)) return api.sendMessage("💵 Mức đặt cược của bạn không phù hợp hoặc dưới 50$!!!", threadID, messageID);
    if (money > 10000 || isNaN(money)) return api.sendMessage("💵 Mức đặt cược của bạn không phù hợp hoặc trên 10000$!!!", threadID, messageID);
    if (moneyUser < money) return api.sendMessage(`💵 Số dư bạn không đủ ${money}$ để có thể chơi`, threadID, messageID);
    try {
        const res = (await axios.get(`https://www.phamvandienofficial.xyz/taixiu`)).data
        const image = [];
        const result = res.result;
        const total = res.total;
        if(result == false) result = '����🏻‍♂️ 3 mặt cùng loại 🤦🏻‍♂️';
        for (let i in res.images) {
            var path = __dirname + `/cache/${i}.png`;
            var img = (await axios.get(`${res.images[i]}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(path, Buffer.from(img, "utf-8"));
            image.push(fs.createReadStream(path));
        }
        if (choose.toLowerCase() == result) {
            await Currencies.increaseMoney(senderID, parseInt(money*2));
            api.sendMessage({ body: `🎋 Bạn đã thắng 🎋\n🧧 Được: ${money*2}$ 🧧\n🍀 Kết quả: ${result} 🍀\n🎲 Tổng 3 mặt: ${total} 🎲`, attachment: image }, threadID, messageID);
        } else {
            await Currencies.decreaseMoney(senderID, parseInt(money));
            api.sendMessage({ body: `🎋 Bạn đã thua 🎋\n🧨 Mất: ${money}$ 🧨\n🍀 Kết quả: ${result} 🍀\n🎲 Tổng 3 mặt: ${total} 🎲`, attachment: image}, threadID, messageID);
        }
        for(var i = 0; i < image.length; i++) {
            fs.unlinkSync(__dirname + `/cache/${i}.png`);
        }
    } catch(e) {
        console.log(e);
        return api.sendMessage('😌Vui lòng chờ!\n🚫 Lỗi không mong muốn, bot sẽ được thay api sớm nhất có thể để không ngắt sự trải nghiệm của bạn ', threadID, messageID);
    }
}
