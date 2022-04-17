import { BaseCommandInteraction, Client, Permissions } from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

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

    await interaction.reply(
      `Vorname: ${interaction.options.get("vorname")?.value}\nNachname: ${
        interaction.options.get("nachname")?.value
      }\nBeruf: ${interaction.options.get("beruf")?.value}`
    );
  },
};

export default Register;
