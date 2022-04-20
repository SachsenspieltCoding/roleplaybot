import {
  BaseCommandInteraction,
  Client,
  GuildMember,
  MessageActionRow,
  MessageEmbed,
  StageChannel,
} from "discord.js";
import Command from "src/Command";
import {
  ApplicationCommandOptionTypes,
  MessageComponentTypes,
} from "discord.js/typings/enums";
import { calls, registeredUsers } from "../Database";
import { Call } from "../class/Call";

const CallCommand: Command = {
  name: "anrufen",
  description: "Ruft einen User an! (Anklopfen in DMs)",
  options: [
    {
      type: ApplicationCommandOptionTypes.USER,
      name: "user",
      description: "Der User, den du anrufen möchtest",
      required: true,
    },
  ],
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const caller = interaction.member as GuildMember;
    const targetUser = interaction.options.getUser("user");

    if (!targetUser) {
      await interaction.editReply("Du musst einen User angeben!");
      return;
    }

    const target: GuildMember | undefined =
      await interaction.guild?.members.fetch({
        user: targetUser.id,
      });

    if (!target) {
      await interaction.editReply(
        "Der angegebene User ist nicht in diesem Server!"
      );
      return;
    }

    if (!caller.voice.channel || !target.voice.channel) {
      await interaction.editReply(
        "Du und dein Gesprächspartner musst dich in einem VoiceChannel befinden um jemanden anzurufen!"
      );
      return;
    } else if (
      caller.voice.channel instanceof StageChannel ||
      target.voice.channel instanceof StageChannel
    ) {
      await interaction.editReply(
        "Du und dein Gesprächspartner musst dich in einem VoiceChannel befinden um jemanden anzurufen!"
      );
      return;
    }

    if (caller.user.id === target.id) {
      await interaction.editReply("Du kannst dich nicht selbst anrufen!");
      return;
    }

    if (targetUser.bot) {
      await interaction.editReply("Du kannst keine Bots anrufen!");
      return;
    }

    if (caller.voice.channel.id === target.voice.channel.id) {
      await interaction.editReply(
        "Du bist bereits mit deinem Gesprächspartner in einem VoiceChannel!"
      );
      return;
    }

    const rpCaller = registeredUsers.getByUserId(caller.user.id);
    const rpTarget = registeredUsers.getByUserId(target.user.id);

    const call = new Call(
      caller,
      target,
      rpCaller ? rpCaller.getFullName() : caller.user.tag,
      rpTarget ? rpTarget.getFullName() : target.user.tag,
      await caller.send("Anruf wird gewählt..."),
      await target.send("Neuer Anruf!"),
      target.voice.channel,
      caller.voice.channel
    );

    const embedCaller = new MessageEmbed({
      title: `Es wird angerufen: ${
        rpTarget
          ? rpTarget.firstname + " " + rpTarget.lastname
          : target.user.tag
      }`,
      footer: {
        text: interaction.guild?.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
    });

    const embedTarget = new MessageEmbed({
      title: `Eingehender Anruf von ${
        rpCaller
          ? rpCaller.firstname + " " + rpCaller.lastname
          : caller.user.tag
      }`,
      footer: {
        text: interaction.guild?.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
    });

    const buttonsCaller = new MessageActionRow({
      type: MessageComponentTypes.BUTTON,
      components: [
        {
          type: MessageComponentTypes.BUTTON,
          label: "Anruf beenden",
          style: "DANGER",
          emoji: "📞",
          customId: `call_${call.id}_end`,
        },
      ],
    });

    const buttonsTarget = new MessageActionRow({
      type: MessageComponentTypes.BUTTON,
      components: [
        {
          type: MessageComponentTypes.BUTTON,
          label: "Anruf annehmen",
          style: "SUCCESS",
          emoji: "📞",
          customId: `call_${call.id}_accept`,
        },
        {
          type: MessageComponentTypes.BUTTON,
          label: "Anruf ablehnen",
          style: "DANGER",
          emoji: "📞",
          customId: `call_${call.id}_decline`,
        },
      ],
    });

    await call.callerMessage.edit({
      content: null,
      embeds: [embedCaller],
      components: [buttonsCaller],
    });

    await call.targetMessage.edit({
      content: null,
      embeds: [embedTarget],
      components: [buttonsTarget],
    });

    calls.add(call);

    await interaction.editReply(
      "Anruf wurde erfolgreich gestartet, schau in deinen DMs nach für weitere Infos!"
    );

    setTimeout(() => {
      if (!call.accepted) call.endCallNotAccepted();
    }, 30 * 1000);
  },
};

export default CallCommand;
