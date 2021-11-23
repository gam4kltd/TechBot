const { MessageEmbed } = require('discord.js')
const profileSchema = require('../../models/profile-schema')
const { profiles } = require('./profile')

const runCode = async (
	guildId,
	authorId,
	section,
	args,
	message,
	interaction
) => {
	let data = profiles[(guildId, authorId)]
	if (!data) {
		const result = await profileSchema.findOne({
			guildId,
			userId: authorId,
		})
		if (result) {
			data = profiles[(guildId, authorId)] = result
		} else {
			const createProfile = await profileSchema.create({
				guildId,
				userId: authorId,
				coins: 0,
				nickname: 'None',
				aboutMe: 'None',
			})
			data = profiles[(guildId, authorId)] = createProfile
		}
	}

	let { coins, nickname, aboutMe } = data

	if (section.toLowerCase() === 'nickname') {
		if (interaction) {
			args.shift()
		}
		nickname = args.join(' ')
		await profileSchema.findOneAndUpdate(
			{
				guildId,
				userId: authorId,
			},
			{
				guildId,
				userId: authorId,
				coins,
				nickname,
				aboutMe,
			},
			{
				upsert: true,
			}
		)
		const nicknameResult = await profileSchema.findOne({
			guildId,
			userId: authorId,
		})
		data = profiles[(guildId, authorId)] = nicknameResult
	} else if (section.toLowerCase() === 'aboutme') {
		if (interaction) {
			args.shift()
		}
		aboutMe = args.join(' ')
		await profileSchema.findOneAndUpdate(
			{
				guildId,
				userId: authorId,
			},
			{
				guildId,
				userId: authorId,
				coins,
				nickname,
				aboutMe,
			},
			{
				upsert: true,
			}
		)
		const aboutMeResult = await profileSchema.findOne({
			guildId,
			userId: authorId,
		})
		data = profiles[(guildId, authorId)] = aboutMeResult
	}

	const username = message ? message.author.username : interaction.user.username

	const text = `*Nickname:* **${nickname}**
*About Me*: **${aboutMe}**`

	const embed = new MessageEmbed().setAuthor(username).setDescription(text)

	return embed
}

module.exports = {
	category: 'Profile',
	description: 'Sets a value of your profile',

	slash: 'both',
	// testOnly: true,
	guildOnly: true,

	minArgs: 2,
	expectedArgs: '<section> <value>',

	options: [
		{
			name: 'section',
			description: 'The section you want to edit.',
			required: true,
			type: 'STRING',
			choices: [
				{
					name: 'nickname',
					value: 'NICKNAME',
				},
				{
					name: 'aboutme',
					value: 'ABOUTME',
				},
			],
		},
		{
			name: 'value',
			description: 'Value you wish to set the section to.',
			required: true,
			type: 'STRING',
		},
	],

	callback: async ({ message, interaction, args }) => {
		const guildId = message ? message.guild.id : interaction.guild.id
		const authorId = message ? message.author.id : interaction.user.id

		const section = message
			? args.shift(' ')
			: interaction.options.getString('section')
		if (section.toLowerCase() === 'nickname') {
			return runCode(guildId, authorId, section, args, message, interaction)
		} else if (section.toLowerCase() === 'aboutme') {
			return runCode(guildId, authorId, section, args, message, interaction)
		} else {
			return 'Please use one of the following for your first parameter: nickname, aboutme.'
		}
	},
}
