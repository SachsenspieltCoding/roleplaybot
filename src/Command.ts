import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from "discord.js";

interface Command extends ChatInputApplicationCommandData {
  execute: (
    client: Client,
    interaction: BaseCommandInteraction
  ) => Promise<void>;
}

export default Command;
