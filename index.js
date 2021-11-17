const DiscordJS = require('discord.js')
const { Intents } = DiscordJS
const path = require('path')
const WOKCommands = require('wokcommands')
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})
require('dotenv').config()

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        testServers: ['910340433941512262'],
        botOwners: ['884094289146150922'],
        mongoUri: process.env.MONGO_URI
    })
        .setCategorySettings([
            {
                name: 'Moderation',
                emoji: '🔨'
            },
            {
                name: 'Admin',
                emoji: '📘'
            },
            {
                name: 'Misc',
                emoji: '🤷‍♂️'
            }
        ])
})

client.login(process.env.TOKEN)