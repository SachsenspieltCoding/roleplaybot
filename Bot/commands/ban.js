//INIT LIBRARYS
const Discord = require("discord.js");
const fs = require("fs");
const time = new Date();

//COMMAND
module.exports.run = (bot, msg, args) => {

    let file;
    let ban_id;

    ban_id = "#" + time.getFullYear().toString() + time.getMonth().toString() + time.getDay().toString() + time.getHours().toString() + time.getMinutes().toString() + time.getSeconds().toString()

    // //READ BAN-ID FILE
    // try {
    //
    //     let rawfile = require("Bot/data/ban-id.js");
    //
    // } catch (e) {
    //
    //     const embed = new Discord.MessageEmbed()
    //         .setTitle("Upss... Hier ist etwas schiefgegangen")
    //         .setColor("RED")
    //         .setDescription("Ein schwerer unbekannter interner Fehler ist aufgetreten! Bitte umgehend das Serverteam informieren!")
    //         .addField("Fehlercode", "0 - CRITICAL_ERROR")
    //         .setFooter(msg.guild.name + " | " + msg.author.tag);
    //
    //     msg.channel.send(embed);
    //     msg.delete();
    //     return false;
    //
    // }


    if (!msg.member.permissions.has("BAN_MEMBERS")) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Upss... Hier ist etwas schiefgegangen")
            .setColor("RED")
            .setDescription("Dir fehlen folgende Rechte um diesen Befehl ausführen zu können: `BAN_MEMBERS`!")
            .addField("Fehlercode", "200 - MISSING_PERMISSION")
            .setFooter(msg.guild.name + " | " + msg.author.tag);

        msg.channel.send(embed);
        msg.delete();
        return false;

    }

    if (!msg.mentions.members.first()) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Upss... Hier ist etwas schiefgegangen")
            .setColor("RED")
            .setDescription("Der angegebene Benutzer `" + args[0] + "` konnte nicht gefunden werden. Bitte makiere in mit einem @ davor!")
            .addField("Fehlercode", "101 - USER_NOT_FOUND")
            .setFooter(msg.guild.name + " | " + msg.author.tag);

        msg.channel.send(embed);
        msg.delete();
        return false;

    }

    const banmember = msg.mentions.members.first();

    //KICK MESSAGE TO KICK MEMBER
    try {

        banmember.createDM(true).then(dmchannel => {

            const embed = new Discord.MessageEmbed()
                .setTitle("Du wurdest gebannt!")
                .setColor("RED")
                .setDescription("Du wurdest soeben von einem Server gebannt!")
                .addField("Server", msg.guild.name)
                .addField("Grund", args.slice(1).join(" "))
                .addField("BanID", ban_id)
                .addField("Gebannt durch", msg.author.tag)
                .addField("Entbannung", "Um einen Entbannungsantrag zu stellen nutze dieses Formular: https://www.ls19-roleplay.tk/entbannung")
                .setFooter("Banning Service vetrieben durch " + bot.user.username);

            dmchannel.send(embed);

            banmember.ban({ reason: args.slice(1).join(" ") });
            // file[ban_id] = dmchannel;
            //
            // let data = JSON.stringify(file);
            // fs.writeFileSync('Bot/db/ban-id.js', data);

        })

    } catch (e) {



    }

    const embed = new Discord.MessageEmbed()
        .setTitle("Benutzer erfolgreich gebannt!")
        .setColor("GREEN")
        .addField("Gebannter Benutzer", banmember.user.tag)
        .addField("Grund", args.slice(1).join(" "))
        .addField("Gebannt durch", msg.author.tag)
        .addField("BanID", ban_id)
        .setFooter("Banning Service vetrieben durch " + bot.user.username);

    msg.channel.send(embed);
    msg.delete();
}

//PROPS FOR HELP COMMAND
module.exports.help = {

    name: "ban",
    usage: "<Mention user> <String reason>",
    description: "Bannt einen Benutzer vom Server",
    permission: "BAN_MEMBERS"

}