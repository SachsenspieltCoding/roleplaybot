import {
  BaseCommandInteraction,
  Client,
  GuildMemberRoleManager,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { idCards } from "../Database";
import { IDCard } from "../class/IDCard";

const FindDriversLicense: Command = {
  name: "führerscheinauskunft",
  description: "Gibt den Führerschein einer Person aus.",
  options: [
    {
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      name: "name",
      description: "Suche Führerschein nach Vor- und Nachname.",
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
        "Suche Führerschein nach Personalausweisidentifikationsnummer.",
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
        `Es konnte kein Führerschein gefunden werden.`
      );
      return;
    }

    const policeRole = interaction.guild?.roles.cache
      .filter((r) => r.name == "Polizei")
      .first();
    const memberRoleManager = interaction.member
      ?.roles as GuildMemberRoleManager;

    if (
      policeRole &&
      interaction.member?.user.id !== idcard.discordUserId &&
      memberRoleManager.cache.filter((r) => r.id === policeRole.id).size <= 0
    ) {
      if (
        !interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
        await interaction.editReply(
          "Für diesen Befehl benötigst du Adminstratoren-Rechte!"
        );
        return;
      }
    }

    const embed = new MessageEmbed({
      title: "FÜHRERSCHEIN BUNDESREPUBLIK DEUTSCHLAND",
      color: "BLUE",
      thumbnail: {
        url: idcard.linkToImage,
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
          name: "Geburtsdatum",
          value: idcard.birthday,
          inline: true,
        },
        {
          name: "Ausstellende Behörde",
          value: idcard.authority,
          inline: true,
        },
        {
          name: "Ausgestellt am",
          value: `${idcard.createdAt.getDate()}.${
            idcard.createdAt.getMonth() + 1
          }.${idcard.createdAt.getFullYear()}`,
          inline: true,
        },
        {
          name: "‎",
          value: "‎",
        },
        {
          name: "B",
          value: idcard.driversLicense.B ? "✓" : "⁄",
          inline: true,
        },
        {
          name: "C",
          value: idcard.driversLicense.C ? "✓" : "⁄",
          inline: true,
        },
        {
          name: "A1",
          value: idcard.driversLicense.A1 ? "✓" : "⁄",
          inline: true,
        },
        {
          name: "AM",
          value: idcard.driversLicense.AM ? "✓" : "⁄",
          inline: true,
        },
        {
          name: "T",
          value: idcard.driversLicense.T ? "✓" : "⁄",
          inline: true,
        },
        {
          name: "L",
          value: idcard.driversLicense.L ? "✓" : "⁄",
          inline: true,
        },
      ],
    });

    await interaction.editReply({ embeds: [embed] });
  },
};

export default FindDriversLicense;
