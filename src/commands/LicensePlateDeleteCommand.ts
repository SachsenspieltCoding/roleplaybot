import { BaseCommandInteraction, Client, Permissions } from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { licensePlates } from "../Database";

const LicensePlateDelete: Command = {
  name: "kennzeichenabmelden",
  description: "Meldet ein Kennzeichen ab",
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "stadtkennzeichner",
      description: "Der vordere Teil des Kennzeichens",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "buchstaben",
      description: "Der mittlere Teil des Kennzeichens",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "zahlen",
      description: "Der hintere Teil des Kennzeichens",
      required: true,
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

    const city = interaction.options.get("stadtkennzeichner")?.value as string;
    const letters = interaction.options.get("buchstaben")?.value as string;
    const numbers = interaction.options.get("zahlen")?.value as string;

    const plate = licensePlates.getByLicensePlateString(
      `${city} ${letters} ${numbers}`
    );

    if (!plate) {
      await interaction.editReply(
        `Das angegebene Kennzeichen ${city} ${letters} ${numbers} konnte nicht gefunden werden!`
      );
      return;
    }

    licensePlates.remove(plate).save();

    await interaction.editReply(
      `Das Kennzeichen ${plate.getLicensePlateString()} wurde erfolgreich abgemeldet!`
    );
  },
};

export default LicensePlateDelete;
