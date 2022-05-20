module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "DungUwU",
 description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "tự rời" : "bị quản trị viên đá";
 if (type == "tự rời") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage({body: `Không thể thêm lại thành viên ${name} vào nhóm :( `, mentions: [{ tag: name, id: event.logMessageData.leftParticipantFbId }]}, event.threadID)
   } else api.sendMessage({body: `Đã thêm lại idol ${name}\nLí do: đã tự out chùa hoặc chưa được sự cho phép của qtv box :) `, mentions: [{ tag: name, id: event.logMessageData.leftParticipantFbId }]}, event.threadID);
  })
 }
}