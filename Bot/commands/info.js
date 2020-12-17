//INIT LIBRARYS
const Discord = require("discord.js");

//COMMAND
module.exports.run = async (bot, msg, args) => {

    if(!args[0]) {

        //CASE: SERVERINFO

        const embed = new Discord.MessageEmbed()
            .setTitle("Server-Info von: " + msg.guild.name)
            .setFooter(msg.guild.name + " | " + msg.author.tag)
            .setThumbnail(msg.guild.iconURL())
            .addField("Besitzer", msg.guild.owner.user.tag)
            .addField("Benutzer", msg.guild.memberCount, true)
            .addField("Region", msg.guild.region, true)
            .addField("Rollen", msg.guild.roles.cache.size - 1, true)
            .addField("Channels und Kategorien", msg.guild.channels.cache.size, true)
            .addField("Erstellung", msg.guild.createdAt.getDay() + "." + msg.guild.createdAt.getMonth() + "." + msg.guild.createdAt.getFullYear())
            .addField("Serverboosts", msg.guild.premiumSubscriptionCount, true)
            .addField("Boostinglevel", msg.guild.premiumTier, true)

        msg.channel.send(embed);
        msg.delete();
        return true;

    } else {

        if(msg.mentions.members.first()) {

            let user = msg.mentions.members.first();

            //CASE: USER

            const embed = new Discord.MessageEmbed()
                .setTitle("Benutzer-Info von: " + user.user.username)
                .setFooter(msg.guild.name + " | " + msg.author.tag)
                .setThumbnail(user.user.avatarURL())
                .addField("Tag", user.user.tag, true)
                .addField("Server betreten", user.joinedAt.getDay() + "." + user.joinedAt.getMonth() + "." + user.joinedAt.getFullYear(), true);

            try {

                embed.addField("Boostet Server", user.premiumSince.getDay() + "." + user.premiumSince.getMonth() + "." + user.premiumSince.getFullYear(), true);

            } catch (e) {

                embed.addField("Boostet Server", "Server wird nicht geboostet");

            }

           embed.addField("Rollen", user.roles.cache.size)
            .addField("ID", user.user.id);

            msg.channel.send(embed);
            msg.delete();
            return true;

        } else {

            const embed = new Discord.MessageEmbed()
                .setTitle("Upss... Hier ist etwas schiefgegangen")
                .setColor("RED")
                .setDescription("Der angegebene Benutzer `" + args[0] + "` konnte nicht gefunden werden. Bitte makiere in mit einem @ davor!")
                .addField("Fehlercode", "101 - USER_NOT_FOUND")
                .setFooter(msg.guild.name + " | " + msg.author.tag);

            msg.channel.send(embed);
            msg.delete();

        }

    }

}

//PROPS FOR HELP COMMAND
module.exports.help = {

    name: "info",
    usage: "<Mention user>",
    description: "Zeigt Informationen zu einzelnen Usern an. Wenn keine Nutzerangabe getätigt wird, werden die Informationen vom aktuellen Server ausgegeben",
    permission: ""

}