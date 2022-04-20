import {
  GuildMember,
  Message,
  MessageActionRow,
  MessageEmbed,
  StageChannel,
  VoiceChannel,
  VoiceState,
} from "discord.js";
import { randomUUID } from "crypto";
import client, { logger } from "../Bot";
import { MessageComponentTypes } from "discord.js/typings/enums";
import { calls } from "../Database";

class Call {
  public id: string;
  public caller: GuildMember;
  public target: GuildMember;
  public rpCaller: string;
  public rpTarget: string;
  public startedAt: Date;

  public callerMessage: Message;
  public targetMessage: Message;

  public callChannel: VoiceChannel;
  public callerChannel: VoiceChannel;

  public accepted: boolean = false;

  constructor(
    caller: GuildMember,
    target: GuildMember,
    rpCaller: string,
    rpTarget: string,
    callerInteraction: Message,
    targetMessage: Message,
    callChannel: VoiceChannel,
    callerChannel: VoiceChannel
  ) {
    this.id = randomUUID().replaceAll("-", "");
    this.caller = caller;
    this.target = target;
    this.rpCaller = rpCaller;
    this.rpTarget = rpTarget;
    this.startedAt = new Date();
    this.callerMessage = callerInteraction;
    this.targetMessage = targetMessage;
    this.callChannel = callChannel;
    this.callerChannel = callerChannel;
  }

  public acceptCall(): void {
    this.accepted = true;

    if (!this.caller.voice.channel || !this.target.voice.channel) {
      this.endCallError();
      return;
    } else if (
      this.caller.voice.channel instanceof StageChannel ||
      this.target.voice.channel instanceof StageChannel
    ) {
      this.endCallError();
      return;
    }

    try {
      this.caller.voice.setChannel(this.target.voice.channelId);
    } catch (e) {
      logger.error(e);
    }

    const button = new MessageActionRow({
      type: MessageComponentTypes.BUTTON,
      components: [
        {
          type: MessageComponentTypes.BUTTON,
          label: "Anruf beenden",
          style: "DANGER",
          emoji: "📞",
          customId: `call_${this.id}_end`,
        },
      ],
    });

    const callerEmbed = new MessageEmbed({
      title: "Anruf angenommen",
      description: `Du telefonierst aktuell mit ${this.rpTarget}.`,
      color: "GREEN",
      footer: {
        text: this.caller.guild.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
    });

    this.callerMessage.edit({
      embeds: [callerEmbed],
      components: [button],
    });

    const targetEmbed = new MessageEmbed({
      title: "Anruf angenommen",
      description: `Du telefonierst aktuell mit ${this.rpCaller}.`,
      color: "GREEN",
      footer: {
        text: this.caller.guild.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
    });

    this.targetMessage.edit({
      embeds: [targetEmbed],
      components: [button],
    });
  }

  public declineCall(): void {
    this.accepted = false;

    const callerEmbed = new MessageEmbed({
      title: "Anruf abgelehnt",
      description: `${this.rpTarget} hat den Anruf abgelehnt.`,
      color: "RED",
      footer: {
        text: this.caller.guild.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
    });

    this.callerMessage.edit({
      embeds: [callerEmbed],
      components: [],
    });

    const targetEmbed = new MessageEmbed({
      title: "Anruf abgelehnt",
      description: `Du hast den Anruf von ${this.rpCaller} abgelehnt.`,
      color: "RED",
      footer: {
        text: this.target.guild.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
    });

    this.targetMessage.edit({
      embeds: [targetEmbed],
      components: [],
    });
  }

  public endCall(): void {
    this.accepted = false;

    const duration = Math.floor(
      (new Date().getTime() - this.startedAt.getTime()) / 1000
    );

    if (this.caller.voice.channel) {
      try {
        this.caller.voice.setChannel(this.callerChannel);
      } catch (e) {
        logger.error(e);
      }
    }

    const callerEmbed = new MessageEmbed({
      title: "Anruf beendet",
      description: `Der Anruf mit ${this.rpTarget} wurde beendet.`,
      color: "RED",
      footer: {
        text: this.caller.guild.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
      fields: [
        {
          name: "Dauer",
          value: `${duration} Sekunden`,
        },
      ],
    });

    this.callerMessage.edit({
      embeds: [callerEmbed],
      components: [],
    });

    const targetEmbed = new MessageEmbed({
      title: "Anruf beendet",
      description: `Der Anruf mit ${this.rpCaller} wurde beendet.`,
      color: "RED",
      footer: {
        text: this.target.guild.name,
        iconURL: client.user?.displayAvatarURL(),
      },
      timestamp: new Date(),
      fields: [
        {
          name: "Dauer",
          value: `${duration} Sekunden`,
        },
      ],
    });

    this.targetMessage.edit({
      embeds: [targetEmbed],
      components: [],
    });

    calls.remove(this);
  }

  public endCallError(): void {
    this.callerMessage.reply(
      "Du oder dein Gesprächspartner hat den VoiceChannel verlassen. Der Anruf wurde beendet."
    );
    this.targetMessage.reply(
      "Du oder dein Gesprächspartner hat den VoiceChannel verlassen. Der Anruf wurde beendet."
    );
    this.endCall();
  }
}

function checkCall(oldVoiceState: VoiceState, newVoiceState: VoiceState) {
  const member = newVoiceState.member;

  if (!member) {
    return;
  }

  if (oldVoiceState.channel == null) return;

  calls
    .getAll()
    .filter((c) => c.caller.id === member.id || c.target.id === member.id)
    .forEach((call) => {
      if (newVoiceState.channelId !== call.callChannel.id) call.endCallError();
      else if (!call.accepted) call.acceptCall();
    });
}

export { Call, checkCall };
