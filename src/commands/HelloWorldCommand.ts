import {BaseCommandInteraction, Client} from 'discord.js'
import Command from 'src/Command'

const HelloWorld: Command = {
  name: 'helloworld',
  description: 'Hallo Welt!',
  execute: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.reply(
        `Hallo Welt! Mein Name ist ${client.user!.tag}, deiner ist ${
            interaction.user.tag
        }!`
    )
  },
}

export default HelloWorld
