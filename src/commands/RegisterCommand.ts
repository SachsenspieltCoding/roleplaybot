import {BaseCommandInteraction, Client} from 'discord.js'
import Command from 'src/Command'

const Register: Command = {
  name: 'register',
  description: 'Registriert einen User für das Roleplay Projekt.',
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.reply(
        `Hallo Welt! Mein Name ist ${client.user!.tag}, deiner ist ${
            interaction.user.tag
        }!`
    )
  },
}

export default Register
