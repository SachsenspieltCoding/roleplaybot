import {
  BaseCommandInteraction,
  Client,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { RegisteredUser } from "../class/RegisteredUser";
import { registeredUsers as database } from "../Database";

const Register: Command = {
  name: "register",
  description: "Registriert einen User für das Roleplay Projekt.",
  options: [
    {
      name: "vorname",
      description: "Der Vorname deines Roleplay-Charakters",
      required: true,
      type: ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "nachname",
      description: "Der Nachname deines Roleplay-Charakters",
      required: true,
      type: ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "beruf",
      description: "Der Beruf deines Roleplay-Charakters",
      required: true,
      type: ApplicationCommandOptionTypes.STRING,
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.reply(
        `Dieser Befehl ist noch nicht vollständig implementiert!`
      );
    }

    for (const x of database.getData) {
      // @ts-ignore
      if (x.record["discordid"] === interaction.user.id) {
        const embed: MessageEmbed = new MessageEmbed({
          title: "Roleplay Anmeldung fehlgeschlagen!",
          description:
            "Es scheint als würdest du bereits registriert sein 🤔. Sollte das nicht der Fall sein melde dich bitte bei der Serverleitung.",
          footer: {
            text: interaction.guild?.name,
            iconURL: client.user?.displayAvatarURL(),
          },
          timestamp: new Date(),
          color: "RED",
        });
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    const registeredUser: RegisteredUser = new RegisteredUser(
      interaction.user.id,
      (interaction.options.get("vorname")?.value as string).trim(),
      interaction.options.get("nachname")?.value as string,
      interaction.options.get("beruf")?.value as string
    );

    database.add(registeredUser.toObject()).save();

    const serverEmbed: MessageEmbed = new MessageEmbed({
      title: "Roleplay Anmeldung erfolgt!",
      description:
        "Du wurdest nun erfolgreich für das Roleplay registriert! In deinen DM's findest du deine Registrierung nochmal. Sobald die Serverleitung dich freigibt, erhälst du Zugang zum Passwort des Servers.",
      footer: {
        text: interaction.guild?.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
      color: "GREEN",
    });

    const dmEmbed: MessageEmbed = new MessageEmbed({
      title: "Deine Registrierung auf " + interaction.guild?.name,
      fields: [
        {
          name: "Vorname",
          value: registeredUser.firstname,
          inline: true,
        },
        {
          name: "Nachname",
          value: registeredUser.lastname,
          inline: true,
        },
        {
          name: "Job",
          value: registeredUser.job,
          inline: true,
        },
        {
          name: "Bewerbung gesendet am",
          value: registeredUser.timestamp.toISOString(),
        },
      ],
      thumbnail: {
        url: interaction.user.displayAvatarURL(),
      },
      footer: {
        text: interaction.guild?.name,
        iconURL: client.user?.displayAvatarURL(),
      },
    });

    await interaction.reply({ embeds: [serverEmbed], ephemeral: true });
    await interaction.user.send({ embeds: [dmEmbed] });
  },
};

export default Register;
