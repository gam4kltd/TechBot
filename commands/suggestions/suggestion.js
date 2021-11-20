const { MessageEmbed } = require('discord.js')
const {
	statusMessages,
	suggestionCache,
} = require('../../features/suggestions')

module.exports = {
	category: 'Admin',
	description: 'Updates the status of a suggestion.',

	requireRoles: true,

	minArgs: 3,
	expectedArgs: '<message> <status> <reason>',

	options: [
		{
			name: 'message',
			description: 'The message ID of the suggestion',
			required: true,
			type: 'NUMBER',
		},
		{
			name: 'status',
			description: 'The status you want to set the message to',
			required: true,
			type: 'STRING',
			choices: [
				{
					name: 'WAITING',
					value: 'WAITING',
				},
				{
					name: 'ACCEPTED',
					value: 'ACCEPTED',
				},
				{
					name: 'DENIED',
					value: 'DENIED',
				},
			],
		},
		{
			name: 'reason',
			description:
				'The reason for the action. put "none" if you don\'t want one',
			required: true,
			type: 'STRING',
		},
	],

	slash: 'both',
	// testOnly: true,
	guildOnly: true,

	callback: async ({ message, interaction, args, guild }) => {
		const messageId = args.shift()

		const status = args.shift().toUpperCase()
		const reason = args.join(' ')

		const newStatus = statusMessages[status]
		if (!newStatus) {
			message.channel.send(
				`Unknown status "${status}", please use ${Object.keys(statusMessages)}`
			)
			message.delete()
			return
		}

		const channelId = suggestionCache()[guild.id]
		if (!channelId) {
			message.channel.send('An error occured, please report this')
			message.delete()
			return
		}

		const channel = guild.channels.cache.get(channelId)
		if (!channel) {
			if (message) {
				message.channel.send('The suggestion channel no longer exists')
				message.delete()
				return
			}

			if (interaction) {
				interaction.reply({
					content: 'The suggestion channel no longer exists',
					ephemeral: true,
				})
				return
			}
		}

		let targetMessage
		try {
			targetMessage = await channel.messages.fetch(messageId, {
				cache: false,
				force: true,
			})
		} catch (err) {
			if (message) {
				message.channel.send(`Message with ID "${messageId}" doesn't exist`)
				message.delete()
				return
			}

			if (interaction) {
				interaction.reply({
					content: `Message with ID "${messageId}" doesn't exist`,
					ephemeral: true,
				})
				return
			}
		}

		const oldEmbed = targetMessage.embeds[0]

		const embed = new MessageEmbed()
			.setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
			.setDescription(oldEmbed.description)
			.setColor(newStatus.color)
			.setFooter('Want to suggest something? Simply type it in this channel')

		if (oldEmbed.fields.length === 2) {
			embed.addFields(oldEmbed.fields[0], {
				name: 'Status',
				value: `${newStatus.text}${
					reason.toLowerCase() == 'none' ? '' : ` Reason: ${reason}`
				}`,
			})
		} else {
			embed.addFields({
				name: 'Status',
				value: `${newStatus.text}${
					reason.toLowerCase() == 'none' ? '' : ` Reason: ${reason}`
				}`,
			})
		}

		targetMessage.edit({
			embeds: [embed],
		})

		if (message) {
			message.channel.send('Status Updated!')
			message.delete()
		}

		if (interaction) {
			interaction.reply({
				content: `Status Updated!`,
				ephemeral: true,
			})
		}

		return
	},
}
