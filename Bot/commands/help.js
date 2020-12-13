//INIT LIBRARYS
const Discord = require("discord.js");

//COMMAND
module.exports.run = (bot, msg, args) => {

    let messagecontainer = [];

    bot.helpProps.forEach((cmd, i) => {

        messagecontainer.push([cmd.name, cmd.usage, cmd.desc, cmd.perm]);

    });

    const embed = new Discord.MessageEmbed()
        .setTitle("Befehlliste von " + bot.user.username)
        .setThumbnail(bot.user.avatarURL())
        .setFooter(msg.guild.name + " | " + msg.author.tag)
        .setColor("GREEN");

    messagecontainer.forEach(command => {

        embed.addField(bot.prefix + command[0], "Usage: " + bot.prefix + command[0] + " " + command[1] + "\nBeschreibung: " + command[2] + "\n\n Benötigte Rechte: " + command[3])

    })

    msg.channel.send(embed);
    msg.delete();

}

//PROPS FOR HELP COMMAND
module.exports.help = {

    name: "help",
    usage: "<>",
    description: "Übersicht über alle Befehle!",
    permission: ""

}