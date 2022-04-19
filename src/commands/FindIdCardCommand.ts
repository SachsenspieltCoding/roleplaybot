import {
  BaseCommandInteraction,
  Client,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { idCards } from "../Database";
import { IDCard } from "../class/IDCard";

const FindIdCard: Command = {
  name: "personalausweisauskunft",
  description: "Gibt den Personalausweis einer Person aus.",
  options: [
    {
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      name: "name",
      description: "Suche Personalausweis nach Vor- und Nachname.",
      options: [
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: "vorname",
          description: "Vorname der gesuchten Person",
          required: true,
        },
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: "nachname",
          description: "Nachname der gesuchten Person",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      name: "id",
      description:
        "Suche Personalausweis nach Personalausweisidentifikationsnummer.",
      options: [
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: "persoid",
          description: "Personalausweisidentifikationsnummer",
          required: true,
        },
      ],
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const vorname = interaction.options.get("vorname")?.value as string;
    const nachname = interaction.options.get("nachname")?.value as string;
    const persoid = interaction.options.get("persoid")?.value as string;

    let idcard: IDCard | null;

    if (vorname && nachname) {
      idcard = idCards.get(
        interaction.options.get("vorname")?.value as string,
        interaction.options.get("nachname")?.value as string
      );
    } else if (persoid) {
      idcard = idCards.getById(persoid);
    } else {
      idcard = null;
    }

    if (!idcard) {
      await interaction.editReply(
        `Es konnte kein Personalausweis gefunden werden.`
      );
      return;
    }

    if (
      interaction.member?.user.id !== idcard.discordUserId &&
      !interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)
    ) {
      await interaction.editReply(
        "Für diesen Befehl benötigst du Administratoren-Rechte!"
      );
      return;
    }

    const embed = new MessageEmbed({
      title: "BUNDESREPUBLIK DEUTSCHLAND",
      thumbnail: {
        url: idcard.linkToImage,
        width: 1000,
      },
      fields: [
        {
          name: "Personalausweisidentifikationsnummer",
          value: idcard.id,
        },
        {
          name: "Nachname",
          value: idcard.lastname,
          inline: true,
        },
        {
          name: "Vorname",
          value: idcard.firstname,
          inline: true,
        },
        {
          name: "Staatsangehörigkeit",
          value: idcard.nationality,
          inline: false,
        },
        {
          name: "Wohnort",
          value: idcard.hometown,
        },
        {
          name: "Geburtsdatum",
          value: idcard.birthday,
          inline: true,
        },
        {
          name: "Geburtsort",
          value: idcard.placeOfBirth,
          inline: true,
        },
        {
          name: "Ausstellende Behörde",
          value: idcard.authority,
          inline: false,
        },
        {
          name: "Ausgestellt am",
          value: `${idcard.createdAt.getDate()}.${
            idcard.createdAt.getMonth() + 1
          }.${idcard.createdAt.getFullYear()}`,
          inline: false,
        },
      ],
      color: "YELLOW",
    });

    await interaction.editReply({ embeds: [embed] });
  },
};

export default FindIdCard;
