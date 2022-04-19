import {
  BaseCommandInteraction,
  Client,
  GuildMemberRoleManager,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { licensePlates } from "../Database";

const Kennzeichen: Command = {
  name: "kennzeichenauskunft",
  description: "Sucht nach einem bestimmten Kennzeichen in der Datenbank",
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

    const policeRole = interaction.guild?.roles.cache
      .filter((r) => r.name == "Polizei")
      .first();

    if (
      policeRole &&
      (interaction.member?.roles as GuildMemberRoleManager).cache.filter(
        (r) => r.id === policeRole.id
      ).size <= 0
    ) {
      if (
        !interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
        await interaction.editReply(
          "Für diesen Befehl benötigst du Administratoren- oder Polizei-Rechte!"
        );
        return;
      }
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

    const embed = new MessageEmbed({
      title: "KENNZEICHENAUSKUNFT",
      fields: [
        {
          name: "Kennzeichen",
          value: plate.getLicensePlateString(),
        },
        {
          name: "zugelassenes Fahrzeug",
          value: plate.vehicle,
          inline: true,
        },
        {
          name: "Motorleistung",
          value: plate.vehicleHorsepower + " PS",
          inline: true,
        },
        {
          name: "Fahrzeugklasse",
          value: plate.vehicleClass,
          inline: true,
        },

        {
          name: "Fahrzeughalter",
          value: `${plate.ownerLastname}, ${plate.ownerFirstname}`,
        },
        {
          name: "Zulassungsbehörde",
          value: plate.authority,
          inline: true,
        },
        {
          name: "zugelassen am",
          value: `${plate.registeredAt.getDate()}.${
            plate.registeredAt.getMonth() + 1
          }.${plate.registeredAt.getFullYear()}`,
          inline: true,
        },
      ],
      color: "DARK_GREEN",
    });

    await interaction.editReply({ embeds: [embed] });
  },
};

export default Kennzeichen;
