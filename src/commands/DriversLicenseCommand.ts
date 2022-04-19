import { BaseCommandInteraction, Client, Permissions } from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { idCards } from "../Database";
import { DriversLicenseTypes } from "../class/DriversLicense";

const DriversLicense: Command = {
  name: "führerschein",
  description: "Fügt einer Person eine Führerschein-Klasse hinzu.",
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "id",
      description: "Personalausweisidentifikationsnummer",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "klasse",
      description: "Führerscheinklasse, welche hinzugefügt werden soll.",
      required: true,
      choices: [
        {
          name: "B-Führerscheinklasse",
          value: "b",
        },
        {
          name: "C-Führerscheinklasse",
          value: "c",
        },
        {
          name: "A1-Führerscheinklasse",
          value: "a1",
        },
        {
          name: "AM-Führerscheinklasse",
          value: "am",
        },
        {
          name: "T-Führerscheinklasse",
          value: "t",
        },
        {
          name: "L-Führerscheinklasse",
          value: "l",
        },
        {
          name: "B-Führerscheinklasse",
          value: "b",
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.BOOLEAN,
      name: "bool",
      description: "Soll die Füherscheinklasse gelöscht werden?",
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

    const idcard = idCards.getById(
      interaction.options.get("id")?.value as string
    );

    if (!idcard) {
      await interaction.editReply(
        `Es konnte kein Führerschein gefunden werden.`
      );
      return;
    }

    const klasse = interaction.options.get("klasse")?.value as string;
    let value = true;
    const bool = interaction.options.get("bool")?.value as boolean;

    if (bool) {
      value = false;
    }

    switch (klasse) {
      case "b":
        idcard.driversLicense.setDriverclass(DriversLicenseTypes.B, value);
        break;
      case "c":
        idcard.driversLicense.setDriverclass(DriversLicenseTypes.C, value);
        break;
      case "a1":
        idcard.driversLicense.setDriverclass(DriversLicenseTypes.A1, value);
        break;
      case "am":
        idcard.driversLicense.setDriverclass(DriversLicenseTypes.AM, value);
        break;
      case "t":
        idcard.driversLicense.setDriverclass(DriversLicenseTypes.T, value);
        break;
      case "l":
        idcard.driversLicense.setDriverclass(DriversLicenseTypes.L, value);
        break;
    }

    idCards.remove(idcard.id).add(idcard).save();

    await interaction.editReply(
      `Die Führerscheinklasse ${klasse.toUpperCase()} wurde erfolgreich dem Führerschein ${
        idcard.id
      } ${value ? "hinzugefügt" : "entzogen"}.`
    );
  },
};

export default DriversLicense;
