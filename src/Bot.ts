//------------------------------------------------------------------------------
// Import Libraries
//------------------------------------------------------------------------------
import {
  Client,
  GuildMember,
  Interaction,
  MessageEmbed,
  PartialGuildMember,
} from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import log4js, { Logger } from 'log4js'

import * as CONFIG from './config.json'

//------------------------------------------------------------------------------
// Init Dotenv & Discord.js
//------------------------------------------------------------------------------
const client: Client = new Client({
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES'],
})
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

client.on('guildMemberAdd', (member: GuildMember): void => {
  var embed: MessageEmbed = new MessageEmbed({
    title: 'Herzlich Willkommen!',
    description: `Der User ${member.user.tag} ist gerade in ${member.guild.name} eingeflogen!`,
    color: 'GREEN',
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({
        format: 'png',
        dynamic: true,
        size: 1024,
      }),
    },
    footer: {
      text: `Aktuelle Useranzahl: ${member.guild.memberCount}`,
      iconURL: client.user?.displayAvatarURL(),
    },
  })

  member.guild.systemChannel?.send({ embeds: [embed] })
})

client.on('guildMemberRemove', (member): void => {
  var embed: MessageEmbed = new MessageEmbed({
    title: 'Schade, dass du gehst :(',
    description: `Der User ${member.user.tag} hat soeben ${member.guild.name} verlassen!`,
    color: 'RED',
    timestamp: new Date(),
    thumbnail: {
      url: member.user.displayAvatarURL({
        format: 'png',
        dynamic: true,
        size: 1024,
      }),
    },
    footer: {
      text: `Aktuelle Useranzahl: ${member.guild.memberCount}`,
      iconURL: client.user?.displayAvatarURL(),
    },
  })

  member.guild.systemChannel?.send({ embeds: [embed] })
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
