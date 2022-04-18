import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { idCards } from "../Database";

const FindIdCard: Command = {
  name: "findidcard",
  description: "Gibt den Personalausweis einer Person aus.",
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "vorname",
      description: "Vorname der gesuchten Person.",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "nachname",
      description: "Nachname der gesuchten Person.",
      required: true,
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    const idcard = idCards.get(
      interaction.options.get("vorname")?.value as string,
      interaction.options.get("nachname")?.value as string
    );
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
          name: "Geburtstag",
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

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default FindIdCard;
