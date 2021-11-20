const pollSchema = require('../models/poll-schema')

module.exports = {
	category: 'Configuration',
	description: 'Sets the advanced polling channel.',

	permissions: ['ADMINISTRATOR'],

	minArgs: 1,
	expectedArgs: '<channel>',
	expectedArgsTypes: ['CHANNEL'],

	slash: 'both',
	// testOnly: true,
	guildOnly: true,

	callback: async ({ guild, message, interaction, args }) => {
		const target = message
			? message.mentions.channels.first()
			: interaction.options.getChannel('channel')
		if (!target || target.type !== 'GUILD_TEXT') {
			return {
				custom: true,
				content: 'Please tag a text channel.',
				ephemeral: true,
			}
		}

		await pollSchema.findOneAndUpdate(
			{
				_id: guild.id,
			},
			{
				_id: guild.id,
				channelId: target.id,
			},
			{
				upsert: true,
			}
		)

		return {
			custom: true,
			content: 'Advanced polling channel set.',
			ephemeral: true,
		}
	},
}
