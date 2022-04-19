import {
  BaseCommandInteraction,
  Client,
  GuildMember,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { IDCard } from "../class/IDCard";
import { idCards, registeredUsers } from "../Database";
import { DriversLicense } from "../class/DriversLicense";

const IdCardCreate: Command = {
  name: "idcardregister",
  description: "Registriert einen neuen Personalausweis",
  options: [
    {
      type: ApplicationCommandOptionTypes.USER,
      name: "besitzer",
      description: "Wem gehört der Personalausweis?",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "vorname",
      description: "Der Vorname des RP-Charakters",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "nachname",
      description: "Der Nachname des RP-Charakters",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "geburtstag",
      description: "Der Geburtstag des RP-Charakters",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "nationalität",
      description: "Der Nationalität des RP-Charakters",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "wohnort",
      description: "Der Wohnort des RP-Charakters",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "geburtsort",
      description: "Der Geburtsort des RP-Charakters",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "behörde",
      description: "Die ausstellende Behörde",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "passbild",
      description: "Link zum Passbild im Discord-CDN",
      required: true,
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getMember("besitzer") as GuildMember;

    if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.editReply(
        "Für diesen Befehl benötigst du Administratoren-Rechte!"
      );
      return;
    }

    const registeredUser = registeredUsers.getByUserId(user.user.id);

    if (!registeredUser) {
      await interaction.editReply(
        `Der User ${user.user.tag} ist nicht registriert!`
      );
      return;
    }

    const input = {
      firstname: interaction.options.get("vorname")?.value as string,
      lastname: interaction.options.get("nachname")?.value as string,
      birthday: interaction.options.get("geburtstag")?.value as string,
      nationality: interaction.options.get("nationalität")?.value as string,
      hometown: interaction.options.get("wohnort")?.value as string,
      placeOfBirth: interaction.options.get("geburtsort")?.value as string,
      authority: interaction.options.get("behörde")?.value as string,
      linkToImage: interaction.options.get("passbild")?.value as string,
    };

    const idcard = new IDCard(
      idCards.getNewIdCardNumber(),
      user.user.id,
      user.guild.id,
      input.firstname,
      input.lastname,
      input.birthday,
      input.nationality,
      input.hometown,
      input.placeOfBirth,
      input.authority,
      input.linkToImage,
      new DriversLicense(false, false, false, false, false, false)
    );

    idCards.add(idcard).save();
    await interaction.editReply(
      `Der Personalausweis für ${user.user.tag} wurde erfolgreich erstellt! Personalausweis-ID: ${idcard.id}`
    );
  },
};

export default IdCardCreate;
