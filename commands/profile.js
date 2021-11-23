const profileSchema = require('../models/profile-schema')
const { MessageEmbed } = require('discord.js')
const profiles = {}

module.exports = {
	category: 'Profile',
	description:
		'Either displays your profile or a command to set a profile property',

	slash: 'both',
	testOnly: true,
	guildOnly: true,

	maxArgs: 0,

	callback: async ({ message, interaction }) => {
		const guildId = message ? message.guild.id : interaction.guild.id
		const authorId = message ? message.author.id : interaction.user.id
		let data = profiles[(guildId, authorId)]
		if (!data) {
			let newResults = await profileSchema.findOne({
				guildId,
				userId: authorId,
			})

			if (!newResults) {
				newResults = await profileSchema.create({
					guildId,
					userId: authorId,
					coins: 0,
					nickname: 'None',
					aboutMe: 'None',
				})
			}

			data = profiles[(guildId, authorId)] = newResults
		}
		const { nickname, aboutMe } = data

		const username = message
			? message.author.username
			: interaction.user.username

		const text = `*Nickname:* **${nickname}**
*About Me*: **${aboutMe}**`
		const embed = new MessageEmbed().setAuthor(username).setDescription(text)

		return embed
	},
}

// await profileSchema.findOneAndUpdate(
// 	{
// 		guildId,
// 		userId: authorId,
// 	},
// 	{
// 		guildId,
// 		userId: authorId,
// 		coins: 0,
// 		nickname: 'None',
// 		aboutMe: 'None',
// 	},
// 	{
// 		upsert: true,
// 	}
// )
