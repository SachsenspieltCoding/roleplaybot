import {
  BaseCommandInteraction,
  Client,
  GuildMemberRoleManager,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { serverInfo as database } from "../Database";

const ServerInfo: Command = {
  name: "serverinfo",
  description: "Gibt alle wichtigen Infos vom LS-Server zurück!",
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const rprole = interaction.guild?.roles.cache.find((role) =>
      role.name.includes("✓")
    );

    if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const roleManager = interaction.member?.roles as GuildMemberRoleManager;
      if (rprole && !roleManager.cache.has(rprole.id)) {
        await interaction.editReply(
          "Für diesen Befehl musst du RP-Teilnehmer oder Serveradministrator sein!"
        );
        return;
      }
    }

    const serverinfo = database.serverInfo;
    const servericon = interaction.guild?.iconURL();

    const embed = new MessageEmbed({
      title: `Serverinfo für ${interaction.guild?.name}`,
      color: "#12bdfc",
      thumbnail: {
        url: "https://cdn.discordapp.com/attachments/965870515518582794/966239840712671272/ls22.png",
      },
      footer: {
        icon_url: servericon ? servericon : undefined,
        text: interaction.guild?.name,
      },
      timestamp: new Date(),
      fields: [
        {
          name: "Servername",
          value: serverinfo.getServername(),
          inline: true,
        },
        {
          name: "Serverpasswort",
          value: serverinfo.getPassword(),
          inline: true,
        },
        {
          name: "‎",
          value: "‎",
          inline: true,
        },
        {
          name: "Serverstandort",
          value: serverinfo.getLocation(),
          inline: true,
        },
        {
          name: "Karte",
          value: serverinfo.getMap(),
          inline: true,
        },
        {
          name: "Serversprache",
          value: serverinfo.getLanguage(),
          inline: true,
        },
      ],
    });

    await interaction.editReply({ embeds: [embed] });
  },
};

export default ServerInfo;
