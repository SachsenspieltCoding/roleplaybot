import { BaseCommandInteraction, Client, Permissions } from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { serverInfo as db } from "../Database";

const SetServerInfo: Command = {
  name: "setserverinfo",
  description: "Setzt alle wichtigen Infos vom LS-Server!",
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "servername",
      description: "Der Name des Servers",
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "passwort",
      description: "Das Passwort des Servers",
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "standort",
      description: "Der Standort des Servers",
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "sprache",
      description: "Die Sprache des Servers",
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "karte",
      description: "Der Karte des Servers",
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.editReply(
        "Für diesen Befehl benötigst du Administratoren-Rechte!"
      );
      return;
    }

    const name = interaction.options.get("servername")
      ? (interaction.options.get("servername")?.value as string)
      : null;
    const password = interaction.options.get("passwort")
      ? (interaction.options.get("passwort")?.value as string)
      : null;
    const location = interaction.options.get("standort")
      ? (interaction.options.get("standort")?.value as string)
      : null;
    const language = interaction.options.get("sprache")
      ? (interaction.options.get("sprache")?.value as string)
      : null;
    const map = interaction.options.get("karte")
      ? (interaction.options.get("karte")?.value as string)
      : null;

    db.serverInfo.setServername(name);
    db.serverInfo.setPassword(password);
    db.serverInfo.setLocation(location);
    db.serverInfo.setLanguage(language);
    db.serverInfo.setMap(map);

    db.save();

    await interaction.editReply("Die Daten wurden erfolgreich aktualisiert!");
  },
};

export default SetServerInfo;
