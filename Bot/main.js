const Discord = require("discord.js");
const bot = new Discord.Client();
const SETTINGS = require("./settings.json");
const TOKEN = SETTINGS.TOKEN;
const PREFIX = SETTINGS.PREFIX;
const time = new Date();
const fs = require("fs");

bot.prefix = PREFIX;
bot.commands = new Discord.Collection();
bot.helpProps = new Map();
bot.commandList = [];

//READING COMMAND FILES
loadCommands();
function loadCommands() {
    fs.readdir("./commands", (error, files) => {

        if(error) console.log(error);

        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if(jsfile.length <= 0) {

            console.log(`[/dev] [${time.getHours()}:${time.getMinutes()}] ERROR: Couldn't find any command files`);
            return;

        }

        jsfile.forEach((f, i) => {

            let props = require("./commands/" + f);
            console.log(`[/commands] [${time.getHours()}:${time.getMinutes()}] Loaded ${f}!`);
            bot.commands.set(props.help.name, props);

            bot.helpProps.set(props.help.name, {name: props.help.name, usage: props.help.usage, desc: props.help.description, perm: props.help.permission});
            bot.commandList[i] = props.help.name;

        });

    });
}

//READY
bot.on("ready", () => {

    console.log(`[/init] [${time.getHours()}:${time.getMinutes()}] Bot started successful as: ` + bot.user.tag);
    bot.user.setPresence({ status: "online", activity:{ name: bot.guilds.cache.size + " Servern", type: "LISTENING" } });

});

//CHECK SERVERS AND UPDATE STATUS
setInterval(() => {

    bot.user.setPresence({ status: "online", activity:{ name: bot.guilds.cache.size + " Servern", type: "LISTENING" } });

}, 6000);

//MESSAGE LISTENER
bot.on("message", async msg => {

    if(msg.author.bot) return;

    if(!msg.content.startsWith(PREFIX)) return;

    let msgArray = msg.content.split(" ");
    let cmd = msgArray[0].replace(PREFIX, "");
    let args = msgArray.slice(1);

    let commandfile = bot.commands.get(cmd);
    if(commandfile) {

        commandfile.run(bot, msg, args);

        console.log(`[/commands] [${time.getHours()}:${time.getMinutes()}] ${msg.author.tag} used command: ${cmd}`);

    } else {

        const embed = new Discord.MessageEmbed()
            .setTitle("Upss... Hier ist etwas schiefgegangen")
            .setColor("RED")
            .setDescription("Der eingegebene Befehl `" + PREFIX + cmd + "` konnte nicht gefunden werden. Bitte überprüfe die Eingabe und Versuche es erneut!")
            .addField("Fehlercode", "100 - COMMAND_NOT_FOUND")
            .setFooter(msg.guild.name + " | " + msg.author.tag);

        msg.channel.send(embed);
        msg.delete();

    }

})

bot.login(TOKEN);