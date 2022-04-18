import { ButtonInteraction } from "discord.js";
import {
  allowInteraction,
  denyInteraction,
} from "./interactions/RegistrationInteractions";

async function interactionReceived(interaction: ButtonInteraction) {
  await interaction.deferReply({ ephemeral: true });

  switch (interaction.customId) {
    case "RB_registration_approve":
      await allowInteraction(interaction);
      break;

    case "RB_registration_deny":
      await denyInteraction(interaction);
      break;
  }
}

export { interactionReceived };
