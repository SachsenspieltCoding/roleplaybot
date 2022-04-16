//------------------------------------------------------------------------------
// Import Libraries
//------------------------------------------------------------------------------
import { Client, Interaction } from 'discord.js'
import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { SlashCommandBuilder } from '@discordjs/builders'
import log4js, { Logger } from 'log4js'

import * as CONFIG from './config.json'

//------------------------------------------------------------------------------
// Init Dotenv & Discord.js
//------------------------------------------------------------------------------
const client: Client = new Client({ intents: [] })
const rest: REST = new REST({ version: '9' }).setToken(CONFIG.BOT_TOKEN)

//------------------------------------------------------------------------------
// Init Logger (log4js)
//------------------------------------------------------------------------------
const logger: Logger = log4js.getLogger()
logger.level = 'debug'

//------------------------------------------------------------------------------
// Start bot
//------------------------------------------------------------------------------
logger.info('Starting bot...')
client.login(CONFIG.BOT_TOKEN)

//------------------------------------------------------------------------------
// Bot Events
//------------------------------------------------------------------------------
client.on('ready', (): void => {
  logger.info(`${client.user!.tag} is ready!`)
})

//------------------------------------------------------------------------------
// Bot Commands
//------------------------------------------------------------------------------
import commands from './CommandIndex'

logger.info('Loading slash commands...')

try {
  rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), {
    body: commands,
  })
  logger.info('Successfully loaded slash commands.')
} catch (error) {
  logger.error(error)
}

client.on('interactionCreate', (interaction: Interaction) => {
  if (interaction.isCommand()) {
    logger.info(`${interaction.user.tag} called /${interaction.commandName}`)

    for (const command of commands) {
      if (command.name === interaction.commandName) {
        command.execute(client, interaction)
      }
    }
  }
})

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------
export default client
export { logger }
