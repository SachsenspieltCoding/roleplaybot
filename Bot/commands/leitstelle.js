//INIT LIBRARYS
const Discord = require("discord.js");

//COMMAND
module.exports.run = async (bot, msg, args) => {

    if (msg.member.roles.cache.has('695295702863183892')) {

        if (!msg.member.roles.cache.has('695297562906984589')) {

            msg.member.roles.add('695297562906984589');
            // good(channel = msg.channel, content = "Leistellendienst erfolgreich begonnen", title = "Leistellendienst gestartet", footer = msg.author.tag);
            const embed = new Discord.MessageEmbed()
                .setTitle("Leistellendienst gestartet")
                .setDescription("Leistellendienst erfolgreich begonnen")
                .setFooter(msg.author.tag);

            msg.channel.send(embed);
            msg.delete();
            return true;

        } else if (msg.member.roles.cache.has('695297562906984589')) {

            msg.member.roles.remove('695297562906984589');
            const embed = new Discord.MessageEmbed()
                .setTitle("Leistellendienst beendet")
                .setDescription("Leistellendienst erfolgreich beendet")
                .setFooter(msg.author.tag);

            msg.channel.send(embed);
            msg.delete();
            return true;

        } else {

            msg.reply("Ups. Da ist was schief gegangen! Bitte den Adminstrator informieren!");

        }

    } else {

        const embed = new Discord.MessageEmbed()
            .setTitle("Upss... Hier ist etwas schiefgegangen")
            .setColor("RED")
            .setDescription("Dir fehlen folgende Rechte um diesen Befehl ausführen zu können: `LEITSTELLEN_BERECHTIGUNG_ROLE`!")
            .addField("Fehlercode", "200 - MISSING_PERMISSION")
            .setFooter(msg.guild.name + " | " + msg.author.tag);

        msg.channel.send(embed);
        msg.delete();
        return false;

    }

}

//PROPS FOR HELP COMMAND
module.exports.help = {

    name: "leitstelle",
    usage: "<>",
    description: `Vergibt die "Leitstelle" Rolle!`,
    permission: "LEITSTELLEN_BERECHTIGUNG_ROLE"

}