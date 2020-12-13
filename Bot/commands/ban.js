//INIT LIBRARYS
const Discord = require("discord.js");

//COMMAND
module.exports.run = async (bot, msg, args) => {

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

    var banmember = msg.mentions.members.first();

    //KICK MESSAGE TO KICK MEMBER
    try {

        banmember.createDM(true).then(dmchannel => {

            const embed = new Discord.MessageEmbed()
                .setTitle("Du wurdest gebannt!")
                .setColor("RED")
                .setDescription("Du wurdest soeben von einem Server gebannt!")
                .addField("Server", msg.guild.name)
                .addField("Grund", args.slice(1).join(" "))
                .addField("Gebannt durch", msg.author.tag)
                .setFooter("Banning Service vetrieben durch " + bot.user.username);

            dmchannel.send(embed);
            dmchannel.delete();

            banmember.ban({ reason: args.slice(1).join(" ") });

        })

    } catch (e) {



    }

    const embed = new Discord.MessageEmbed()
        .setTitle("Benutzer erfolgreich gebannt!")
        .setColor("GREEN")
        .addField("Gekickter Benutzer", banmember.user.tag)
        .addField("Grund", args.slice(1).join(" "))
        .addField("Gekickt durch", msg.author.tag)
        .setFooter("Kicking Service vetrieben durch " + bot.user.username);

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