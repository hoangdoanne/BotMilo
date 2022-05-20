module.exports.config = {
    name: "    ",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Duy Cute UwU",
    description: "nothing",
    commandCategory: "Admin",
    usages: "",
    cooldowns:0
};

module.exports.run = async function({ api, event }) {
       let dny = ["Bạn đã biết.","Phúc là một admin dễ thương.","Ngực là chân lý.","Gái gú chỉ là phù du. ","Phúc là một admin cute.","Bạn đang thở.","Đây là Bot của Phúc.","Bot MiLo không dùng sim để chém gió.","Trái đất hình vuông.","Anh Phúc 15cm thôi.","Chim cánh cụt có thể bay.","Anh Phúc Yêu tất cả các chị.","Đầu buồi.","Con Cặc.","Có cái lồn.","Địt mẹ mày.","Anh yêu em.","Hãy trao cho anh.","Á ĐÙ","F"];
       api.sendMessage('[ Bot MiLo ❤ ]:' + dny[Math.floor(Math.random()*dny.length)], event.threadID,event.messageID);
}