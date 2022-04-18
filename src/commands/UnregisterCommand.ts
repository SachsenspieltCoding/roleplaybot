import {
  BaseCommandInteraction,
  Client,
  GuildMember,
  GuildMemberRoleManager,
  MessageEmbed,
  Permissions,
} from "discord.js";
import Command from "src/Command";
import { registeredUsers } from "../Database";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

const Unregister: Command = {
  name: "unregister",
  description: "Löscht einen User aus den Datenbanken",
  options: [
    {
      type: ApplicationCommandOptionTypes.USER,
      name: "member",
      description:
        "Das Servermitglied, welches aus der Datenbank gelöscht werden soll",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "grund",
      description: "Warum wurde der User entfernt?",
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    const guildMember = interaction.options.getMember("member") as GuildMember;
    const registeredUser = registeredUsers.getByUserId(guildMember.user.id);
    const reason = interaction.options.get("grund")
      ? interaction.options.get("grund")?.value + ""
      : null;

    if (
      guildMember.user.id !== interaction.member?.user.id &&
      !interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)
    ) {
      await interaction.reply(
        "Für diesen Befehl benötigst du Administratoren-Rechte!"
      );
      return;
    }

    if (registeredUser == null) {
      await interaction.reply({
        content: `Der User ${guildMember.user.tag} konnte nicht in der Datenbank gefunden werden!`,
        ephemeral: true,
      });
      return;
    }

    const roles = interaction.guild?.roles.cache
      .filter((r) => r.name.includes("▮") || r.name.includes("✓"))
      .toJSON();

    if (roles) {
      for (const role of roles) {
        try {
          await (guildMember.roles as GuildMemberRoleManager).remove(role);
        } catch (e) {}
      }
    }

    const embed = new MessageEmbed({
      title: "Du wurdest vom Roleplay abgemeldet :(",
      description:
        "Aus irgendeinem Grund wurdest du aus unseren Datenbanken gelöscht. Somit wurden alle Daten und dein Roleplay-Charakter entfernt. Vermutliche liegt das daran, dass du oder die Serverleitung dich vom Roleplay ausgetragen hat!",
      color: "RED",
      timestamp: new Date(),
      footer: {
        text: interaction.guild?.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      fields: reason ? [{ name: "Begründung", value: reason }] : undefined,
    });

    await guildMember.send({ embeds: [embed] });

    registeredUsers.remove(registeredUser).save();
    // ToDo: Other deletion stuff

    await interaction.reply({
      content: `Der User ${guildMember.user.tag} wurde erfolgreich vom Roleplay abgemeldet!`,
      ephemeral: true,
    });
  },
};

export default Unregister;
