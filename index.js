const DiscordJS = require('discord.js')
const { Intents } = DiscordJS
const path = require('path')
const WOKCommands = require('wokcommands')
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})
require('dotenv').config()

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands')
    })
})

client.login(process.env.TOKEN)