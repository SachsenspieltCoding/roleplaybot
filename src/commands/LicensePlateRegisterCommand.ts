import {
  BaseCommandInteraction,
  Client,
  ColorResolvable,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { licensePlates } from "../Database";
import { LicensePlate } from "../class/LicensePlate";

const LicensePlateCreate: Command = {
  name: "kennzeichen",
  description: "Registriert einen neues Kfz-Kennzeichen",
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "vorname",
      description: "Der Vorname des Besitzers",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "nachname",
      description: "Der Nachname des Besitzers",
      required: true,
    },
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
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "typ",
      description: "Der Typ des Kennzeichens",
      required: true,
      choices: [
        {
          name: "Normal (schwarz)",
          value: "normal",
        },
        {
          name: "Steuerbefreit (grün)",
          value: "taxfree",
        },
        {
          name: "Überführungs- und Händlerkennzeichen (rot)",
          value: "temp",
        },
        {
          name: "Behördenkennzeichen (schwarz)",
          value: "authority",
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "fahrzeug",
      description: "Das Fahrzeug, welches Zugelassen wird",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "fahrzeugklasse",
      description: "Die Fahrzeugklasse",
      required: true,
      choices: [
        {
          name: "B-Fahrzeugklasse",
          value: "b",
        },
        {
          name: "C-Fahrzeugklasse",
          value: "c",
        },
        {
          name: "A1-Fahrzeugklasse",
          value: "a1",
        },
        {
          name: "AM-Fahrzeugklasse",
          value: "am",
        },
        {
          name: "T-Fahrzeugklasse",
          value: "t",
        },
        {
          name: "L-Fahrzeugklasse",
          value: "l",
        },
        {
          name: "keine Fahrzeugklasse (Übergangskennzeichen)",
          value: "/",
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.INTEGER,
      name: "motorleistung",
      description: "Die Motorleistung des Fahrzeuges in PS",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "behörde",
      description: "Die ausstellende Behörde",
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

    const firstname = interaction.options.get("vorname")?.value as string;
    const lastname = interaction.options.get("nachname")?.value as string;
    const city = (
      interaction.options.get("stadtkennzeichner")?.value as string
    ).toUpperCase();
    const letters = (
      interaction.options.get("buchstaben")?.value as string
    ).toUpperCase();
    const numbers = (
      interaction.options.get("zahlen")?.value as string
    ).toUpperCase();
    const typeFromOption = interaction.options.get("typ")?.value as string;
    const vehicle = interaction.options.get("fahrzeug")?.value as string;
    const vehicleClass = interaction.options.get("fahrzeugklasse")
      ?.value as string;
    const vehicleHorsepower = interaction.options.get("motorleistung")
      ?.value as number;
    const authority = interaction.options.get("behörde")?.value as string;

    const searchedPlate = licensePlates.getByLicensePlateString(
      `${city} ${letters} ${numbers}`
    );

    if (searchedPlate) {
      await interaction.editReply(
        `Das Kennzeichen ${city} ${letters} ${numbers} ist bereits vergeben!`
      );
      return;
    }

    let color: ColorResolvable;
    let type: "NORMAL" | "TAXFREE" | "TEMPORARY" | "AUTHORITY";

    switch (typeFromOption) {
      case "normal":
        type = "NORMAL";
        color = "DARK_BUT_NOT_BLACK";
        break;
      case "taxfree":
        type = "TAXFREE";
        color = "GREEN";
        break;
      case "temp":
        type = "TEMPORARY";
        color = "RED";
        break;
      case "authority":
        type = "AUTHORITY";
        color = "NOT_QUITE_BLACK";
        break;
      default:
        type = "NORMAL";
        color = "DARK_BUT_NOT_BLACK";
        break;
    }

    const plate = new LicensePlate(
      city,
      letters,
      numbers,
      type,
      color,
      vehicle,
      vehicleClass.toUpperCase(),
      vehicleHorsepower,
      firstname,
      lastname,
      authority
    );

    licensePlates.add(plate).save();
    await interaction.editReply(
      `Das Kennzeichen ${plate.getLicensePlateString()} wurde erfolgreich erstellt!`
    );
  },
};

export default LicensePlateCreate;
