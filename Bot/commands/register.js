//INIT LIBRARYS
const Discord = require("discord.js");
const time = new Date();

//COMMAND
module.exports.run = async (bot, msg, args) => {

    if(!msg.member.permissions.has("ADMINISTRATOR")) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Upss... Hier ist etwas schiefgegangen")
            .setColor("RED")
            .setDescription("Dir fehlen folgende Rechte um diesen Befehl ausführen zu können: `ADMINISTRATOR`!")
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

    var registermember = msg.mentions.members.first();
    var args = args.slice(1);
    var database = msg.guild.channels.cache.get("725052251269235348");
    let job = "";

    if (!args.length >= 5) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Upss... Hier ist etwas schiefgegangen")
            .setColor("RED")
            .setDescription("Etwas stimmt mit dem Befehl nicht... Bitte überprüfe alle angegebene Argumente!")
            .addField("Fehlercode", "102 - BAD_ARGUMENTS")
            .setFooter(msg.guild.name + " | " + msg.author.tag);

        msg.channel.send(embed);
        msg.delete();
        return false;

    }

    registermember.createDM(true).then(dmchannel => {

        registermember.roles.add(["756481115036057682", "756212468308508693", "756209885955358851", "756211270176211055", "756212842469916723", "756404346975158285", "756215825790140496"]);
        registermember.setNickname(args[0].replace("-", " "));

        var embed = new Discord.MessageEmbed()
            .setTitle(args[0].replace("-", " "))
            .setColor("GREY")
            .setFooter("Registriert durch: " + msg.author.username)
            .addField("Alter", args[1]);

        switch (args[2]) {

            case "BGA":
                job = "Biogasanlage"
                registermember.roles.add("695295455315099718")
                break;

            case "EGH":
                job = "Eigener Hof";
                registermember.roles.add("695295317113045053");
                break;

            case "LU":
                job = "Lohnunternehmen";
                registermember.roles.add("695304521462579250");
                break;

            case "FzH":
                job = "Fahrzeughändler";
                registermember.roles.add("695302521476087889");
                break;

            case "LH":
                job = "Landhandel";
                registermember.roles.add("695302521476087889");
                break;

            case "Pol":
                job = "Polizei";
                registermember.roles.add("695295610483638305");
                break;

            case "FW":
                job = "Feuerwehr";
                registermember.roles.add("698838726989709382");
                break;

            default:
                const embed = new Discord.MessageEmbed()
                    .setTitle("Upss... Hier ist etwas schiefgegangen")
                    .setColor("RED")
                    .setDescription("Der angegebene Beruf `" + args[1] + "` konnte nicht gefunden werden. Bitte überprüfe die Eingabe! Eine Liste über alle Abkürzungen hier: https://www.ls19-roleplay.tk/jobs.txt")
                    .addField("Fehlercode", "300 - JOB_NOT_FOUND")
                    .setFooter(msg.guild.name + " | " + msg.author.tag);

                msg.channel.send(embed);
                msg.delete();
                return false;
                break;

        }

        embed.addField("Beruf", job)
            .addField("Aktivität", args[3] + " Tag(e)")
            .addField("Reife", args[4])
            .addField("Discord Tag", registermember.user.tag);

        if(args[5]) {

            embed.addField("Sonstige Notizen", args.slice(5).join(" "));

        }

        database.send(embed);

        dmchannel.send("Du wurdest soeben für " + msg.guild.name + " registriert! Bitte überprüfe alle Angaben. Sollten Fehler entstanden sein, melde dich bite umgehend bei Jonas Luftig oder (bevorzugt) Christian Jürgens!");
        dmchannel.send(embed);
        dmchannel.delete();

        msg.react("👍");
    })

}

//PROPS FOR HELP COMMAND
module.exports.help = {

    name: "register",
    usage: "<Mention user> <String name> <String age> <String job> <String activity> <String iq>",
    description: "Registriert einen User als Roleplay Teilnehmer",
    permission: "ADMINISTRATOR"

}