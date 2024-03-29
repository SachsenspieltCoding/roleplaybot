//------------------------------------------------------------------------------
// Import Libraries
//------------------------------------------------------------------------------
import {
  Client,
  GuildMember,
  Interaction,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import log4js, { Logger } from "log4js";

import * as CONFIG from "./config.json";
//------------------------------------------------------------------------------
// Bot Commands
//------------------------------------------------------------------------------
import commands from "./CommandIndex";
import { loadDatabases } from "./Database";
import { interactionReceived } from "./ButtonInteractionManager";
import { checkCall } from "./class/Call";

//------------------------------------------------------------------------------
// Init Dotenv & Discord.js
//------------------------------------------------------------------------------
const client: Client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_VOICE_STATES",
  ],
});
const rest: REST = new REST({ version: "9" }).setToken(CONFIG.BOT_TOKEN);

//------------------------------------------------------------------------------
// Init Logger (log4js)
//------------------------------------------------------------------------------
const logger: Logger = log4js.getLogger();
logger.level = "debug";

//------------------------------------------------------------------------------
// Start bot
//------------------------------------------------------------------------------
logger.info("Starting bot...");
loadDatabases();
client.login(CONFIG.BOT_TOKEN);

function shutdown(): void {
  logger.info("Shutting down...");
  client.user!.setPresence({ status: "invisible" });
  client.destroy();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown());
process.on("SIGINT", () => shutdown());

//------------------------------------------------------------------------------
// Bot Events
//------------------------------------------------------------------------------
client.on("ready", (): void => {
  logger.info(`${client.user!.tag} is ready!`);
  client.user?.setPresence({
    status: "online",
    activities: [
      {
        name: `LS22 Roleplay Projekt | Bot-Version ${process.env.npm_package_version}`,
        type: "PLAYING",
      },
    ],
  });
});

client.on("guildMemberAdd", (member: GuildMember): void => {
  if (member.user.id === client.user?.id) return;
  const embed: MessageEmbed = new MessageEmbed({
    title: "Herzlich Willkommen!",
    description: `Der User ${member.user.tag} ist gerade in ${member.guild.name} eingeflogen!`,
    color: "GREEN",
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      }),
    },
    footer: {
      text: `Aktuelle Useranzahl: ${member.guild.memberCount}`,
      iconURL: client.user?.displayAvatarURL(),
    },
  });

  member.guild.systemChannel?.send({ embeds: [embed] });
});

client.on("guildMemberRemove", (member): void => {
  if (member.user.id === client.user?.id) return;
  const embed: MessageEmbed = new MessageEmbed({
    title: "Schade, dass du gehst :(",
    description: `Der User ${member.user.tag} hat soeben ${member.guild.name} verlassen!`,
    color: "RED",
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      }),
    },
    footer: {
      text: `Aktuelle Useranzahl: ${member.guild.memberCount}`,
      iconURL: client.user?.displayAvatarURL(),
    },
  });

  member.guild.systemChannel?.send({ embeds: [embed] });
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.channel instanceof TextChannel) {
    if (message.channel.topic?.includes("!PASSBILD")) {
      if (message.attachments.size > 0) {
        let attaches: string[] = [];
        for (const messageAttachment of message.attachments.toJSON()) {
          if (messageAttachment.contentType === "image/jpeg" || "image/png") {
            attaches.push(messageAttachment.url);
          }
        }
        message.reply(
          `**DISCORD-CDN LINKS:\n**\`\`\`${attaches.join("\n")}\`\`\``
        );
      }
    }
  }
});

client.on("interactionCreate", (interaction: Interaction) => {
  if (interaction.isCommand()) {
    if (!interaction.guild) {
      interaction.reply("Dieser Bot ist in DMs deaktiviert!");
      return;
    }
    if (!interaction.channel) {
      interaction.reply({
        content: "Du scheinst dich in keinem Text Kanal zu befinden!",
        ephemeral: true,
      });
      return;
    }

    logger.info(`${interaction.user.tag} called /${interaction.commandName}`);

    for (const command of commands) {
      if (command.name === interaction.commandName) {
        command.execute(client, interaction).catch((e) => {
          interaction.channel?.send({
            content: "Ein interner Fehler ist aufgetreten\n```" + e + "```",
          });
        });
      }
    }
  } else if (interaction.isButton()) {
    interactionReceived(interaction).catch((e) => {
      interaction.channel?.send({
        content: "Ein interner Fehler ist aufgetreten\n```" + e + "```",
      });
    });
  }
});

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  checkCall(oldVoiceState, newVoiceState);
});

//------------------------------------------------------------------------------
// Bot Commands
//------------------------------------------------------------------------------
logger.info("Loading slash commands...");

try {
  rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), {
    body: commands,
  });
  logger.info("Successfully loaded slash commands.");
} catch (error) {
  logger.error(error);
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------
export default client;
export { logger };
