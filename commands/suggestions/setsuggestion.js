const suggestionSchema = require('../../models/suggestion-schema')
const { fetchSuggestionChannels } = require('../../features/suggestions')

module.exports = {
    category: 'Configuration',
    description: 'Sets the suggestion channel.',

    permissions: ['ADMINISTRATOR'],

    minArgs: 1,
    expectedArgs: '<channel>',
    expectedArgsTypes: ['CHANNEL'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: async ({ message, interaction }) => {
        const channel = message ? message.mentions.channels.first() : interaction.options.getChannel('channel')
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return {
                custom: true,
                content: 'Please tag a text channel',
                ephemeral: true
            }
        }
        const channelId = channel.id
        const guildId = message ? message.guild.id : interaction.guild.id
        
        await suggestionSchema.findOneAndUpdate({
            _id: guildId
        }, {
            _id: guildId,
            channelId,
        }, {
            upsert: true
        })

        fetchSuggestionChannels(guildId)

        return {
            custom: true,
            content: `The suggestions channel has been set to ${channel}`,
            ephemeral: true
        }
    }
}