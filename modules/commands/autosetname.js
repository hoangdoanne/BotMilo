module.exports.config = {
	name: "autosetname",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "NDKhÃ¡nh",
	description: "autosetname",
	commandCategory: "other",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async ({ event, api, args, permssion }) => {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "autosetname.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, setname : "" };
    switch (args[0]) {
        case "add": {
                if (permssion == 0) return api.sendMessage("Báº¡n khÃ´ng Ä‘á»§ quyá»n háº¡n Ä‘á»ƒ cÃ³ thá»ƒ sá»­ dá»¥ng thÃªm name auto!", threadID, messageID);
                if (content.length == 0) return api.sendMessage("Pháº§n nháº­p name set khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng", threadID, messageID);
                    thisThread.setname = content
                writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
                api.sendMessage('Say Ok\nname auto set!', threadID, messageID);        
        }
        case "view": {
            if (!thisThread.setname) return api.sendMessage("NhÃ³m cá»§a báº¡n hiá»‡n táº¡i chÆ°a cÃ³ tÃªn auto setname", threadID, messageID);
            api.sendMessage(`kích hoạt tự động set bd cho thành viên mới kèm kí tự ${thisThread.setname}`, threadID, messageID);
            break;
            
        }
        case "rm":
        case "remove":
        case "del": {
                if (permssion == 0) return api.sendMessage("Báº¡n khÃ´ng Ä‘á»§ quyá»n háº¡n Ä‘á»ƒ cÃ³ thá»ƒ sá»­ dá»¥ng xÃ³a name auto!", threadID, messageID);
                if (!thisThread.setname) return api.sendMessage("NhÃ³m cá»§a báº¡n chÆ°a cÃ³ tÃªn auto setname Ä‘á»ƒ cÃ³ thá»ƒ xÃ³a!", threadID, messageID);
                thisThread.setname = "";
                api.sendMessage(`ÄÃ£ xÃ³a thÃ nh cÃ´ng auto setname!`, threadID, messageID);
                break;
            }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}