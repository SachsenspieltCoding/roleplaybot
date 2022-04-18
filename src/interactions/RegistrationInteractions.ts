import {
  ButtonInteraction,
  DMChannel,
  Message,
  MessageEmbed,
} from "discord.js";
import client, { logger } from "../Bot";
import { registeredUsers } from "../Database";

async function allowInteraction(interaction: ButtonInteraction): Promise<void> {
  const registration = registeredUsers.get(interaction.message.content);

  if (!registration) {
    await interaction.editReply("Diese Registrierung existiert nicht mehr!");
    return;
  }

  if (!registration.pending) {
    await interaction.editReply(
      "Diese Registrierung wurde bereits bearbeitet!"
    );
    return;
  }

  const guild = await client.guilds.fetch(registration.guildid);
  const user = await guild.members.fetch(registration.userid);
  const roles = guild.roles.cache.filter(
    (r) => r.name.includes("▮") || r.name.includes("✓")
  );

  await user.roles.add(roles);

  const embed = new MessageEmbed({
    title: "Deine Registrierung wurde gesichtet!",
    description:
      "Du darfst nun den LS-Server betreten! Um die Zugangsdaten zu erhalten, steht dir ab sofort der Befehl /serverinfo auf dem Discord zur Verfügung. Bitte denke daran, dass die Weitergabe des Passworts zum Ausschluss führen kann!",
    color: "GREEN",
    timestamp: new Date(),
    footer: {
      text: guild.name,
      iconURL: client.user?.displayAvatarURL(),
    },
  });

  await user.send({ embeds: [embed] });

  const newOwnerEmbed = new MessageEmbed({
    title: "Neue Registrierung auf " + guild.name,
    fields: [
      {
        name: "Discord-User",
        value: `<@${interaction.user.id}>`,
      },
      {
        name: "Vorname",
        value: registration.firstname,
        inline: true,
      },
      {
        name: "Nachname",
        value: registration.lastname,
        inline: true,
      },
      {
        name: "Job",
        value: registration.job,
        inline: true,
      },
      {
        name: "Bewerbung gesendet am",
        value: registration.timestamp.toISOString(),
      },
    ],
    thumbnail: {
      url: user.displayAvatarURL(),
    },
    footer: {
      text: guild.name,
      iconURL: client.user?.displayAvatarURL(),
    },
    timestamp: registration.timestamp,
    color: "GREEN",
  });

  for (const omsg of registration.ownerMessages) {
    let msg: Message | null;
    let channel;

    try {
      channel = (await client.channels.fetch(omsg.channelid)) as DMChannel;
      if (channel) msg = await channel.messages.fetch(omsg.messageid);
      else msg = null;
    } catch (e) {
      msg = null;
    }

    if (msg) {
      await msg.edit({
        embeds: [newOwnerEmbed],
      });
      registration.setFinished();
      registeredUsers.remove(registration).add(registration).save();
    }
  }

  await interaction.editReply("Registrierung erfolgreich angenommen!");
  logger.info(`${interaction.user.tag} approved ${user.user.tag}`);
}

async function denyInteraction(interaction: ButtonInteraction): Promise<void> {
  const registration = registeredUsers.get(interaction.message.content);

  if (!registration || !registration.pending) {
    await interaction.editReply(
      "Diese Registrierung wurde bereits bearbeitet!"
    );
    return;
  }

  const guild = await client.guilds.fetch(registration.guildid);
  const user = await guild.members.fetch(registration.userid);
  const roles = guild.roles.cache.filter((r) => r.name.includes("▮"));
  await user.roles.add(roles);

  const embed = new MessageEmbed({
    title: "Deine Registrierung wurde abgelehnt :(",
    description:
      "Aus irgendeinem Grund wurde deine Registrierung nicht angenommen. Das könnte an einem temporären oder permanenten Ausschluss liegen oder an fehlerhaften Daten. Überprüfe deine Eingaben und frage gegebenenfalls bei der Serverleitung nach!",
    color: "RED",
    timestamp: new Date(),
    footer: {
      text: guild.name,
      iconURL: client.user?.displayAvatarURL(),
    },
  });

  await user.send({ embeds: [embed] });

  const newOwnerEmbed = new MessageEmbed({
    title: "Neue Registrierung auf " + guild.name,
    fields: [
      {
        name: "Discord-User",
        value: `<@${interaction.user.id}>`,
      },
      {
        name: "Vorname",
        value: registration.firstname,
        inline: true,
      },
      {
        name: "Nachname",
        value: registration.lastname,
        inline: true,
      },
      {
        name: "Job",
        value: registration.job,
        inline: true,
      },
      {
        name: "Bewerbung gesendet am",
        value: registration.timestamp.toISOString(),
      },
    ],
    thumbnail: {
      url: user.displayAvatarURL(),
    },
    footer: {
      text: guild.name,
      iconURL: client.user?.displayAvatarURL(),
    },
    timestamp: registration.timestamp,
    color: "RED",
  });

  for (const omsg of registration.ownerMessages) {
    let msg: Message | null;
    let channel;

    try {
      channel = (await client.channels.fetch(omsg.channelid)) as DMChannel;
      if (channel) msg = await channel.messages.fetch(omsg.messageid);
      else msg = null;
    } catch (e) {
      msg = null;
    }

    if (msg) {
      await msg.edit({
        embeds: [newOwnerEmbed],
      });
      registration.removeOwnerMessage(omsg);
      registeredUsers.remove(registration).add(registration).save();
    }
  }

  registeredUsers.remove(registration).save();

  await interaction.editReply("Registrierung erfolgreich abgelehnt!");
  logger.info(`${interaction.user.tag} denied ${user.user.tag}`);
}

export { allowInteraction, denyInteraction };
