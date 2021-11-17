const welcomeSchema = require('../../models/welcome-schema')

module.exports = {
    category: 'Configuration',
    description: 'Sets the welcome channel.',

    permissions: ['ADMINISTRATOR'],

    minArgs: 2,
    expectedArgs: '<channel> <text>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: async ({ guild, message, interaction, args }) => {

        const target = message ? message.mentions.channels.first() : interaction.options.getChannel('channel')
        if (!target || target.type !== 'GUILD_TEXT') {
            return {
                custom: true,
                content: 'Please tag a text channel.',
                ephemeral: true
            }
        }

        let text = interaction?.options.getString('text')
        if (message) {
            args.shift()
            text = args.join(' ')
        }

        await welcomeSchema.findOneAndUpdate({
            _id: guild.id,
        }, {
            _id: guild.id,
            text,
            channelId: target.id
        }, {
            upsert: true
        })

        return {
            custom: true,
            content: 'Welcome channel set.',
            ephemeral: true
        }
    }
}