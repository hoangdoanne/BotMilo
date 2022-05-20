module.exports.config = {
    name: "taglientuc",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Hoàng 🥀",
    description: "Tag liên tục người bạn tag trong 5 lần\nCó thể gọi là gọi hồn người đó",
    commandCategory: "group",
    usages: "taglientuc @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn tag", event.threadID);
 let name =  event.mentions[mention];
    var arraytag = [];
        arraytag.push({id: mention, tag: name});
    var a = function (a) { api.sendMessage(a, event.threadID); }
a("Bắt đầu tag !");
setTimeout(() => {a({body: "Đ!t con mẹ mày" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 23000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 28500);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 31000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 36000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 39000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 40000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 65000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 70000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 75000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 80000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 85000);
setTimeout(() => {a("")} , 90000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 95000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 100000);
setTimeout(() => {a({body: "" + " " + name, mentions: arraytag})}, 105000);
setTimeout(() => {a("")} , 110000);


  
  }