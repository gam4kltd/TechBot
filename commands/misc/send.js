const { Message } = require('discord.js')

module.exports = {
	category: 'Configuration',
	description: 'Sends a message.',

	permissions: ['ADMINISTRATOR'],

	minArgs: 2,
	expectedArgs: '<channel> <text>',
	expectedArgsTypes: ['CHANNEL', 'STRING'],

	slash: 'both',
	// testOnly: true,
	guildOnly: true,

	callback: ({ message, interaction, args }) => {
		const channel = message
			? message.mentions.channels.first()
			: interaction.options.getChannel('channel')
		if (!channel || channel.type !== 'GUILD_TEXT') {
			return {
				custom: true,
				content: 'Please tag a text channel.',
				ephemeral: true,
			}
		}

		args.shift() // Remove the channel from the args array
		const text = args.join(' ')

		channel.send(text)

		if (interaction) {
			interaction.reply({
				content: 'Sent message.',
				ephemeral: true,
			})
		}
	},
}
