import { ButtonInteraction } from "discord.js";
import {
  allowInteraction,
  denyInteraction,
} from "./interactions/RegistrationInteractions";
import { calls } from "./Database";

async function interactionReceived(interaction: ButtonInteraction) {
  if (interaction.customId.startsWith("RB_registration")) {
    await interaction.deferReply({ ephemeral: true });
    switch (interaction.customId) {
      case "RB_registration_approve":
        await allowInteraction(interaction);
        break;

      case "RB_registration_deny":
        await denyInteraction(interaction);
        break;
    }

    return;
  }

  if (interaction.customId.startsWith("call")) {
    const call = calls.get(interaction.customId.split("_")[1]);
    if (!call) {
      await interaction.reply("Der Anruf wurde nicht gefunden!");
      return;
    }

    if (interaction.customId.endsWith("_accept")) {
      call.acceptCall();
      return;
    } else if (interaction.customId.endsWith("_decline")) {
      call.declineCall();
      return;
    } else if (interaction.customId.endsWith("_end")) {
      call.endCall();
      return;
    }
  }

  await interaction.reply("Dieser Button wurde noch nicht implementiert!");
}

export { interactionReceived };
