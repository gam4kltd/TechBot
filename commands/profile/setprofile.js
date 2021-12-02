const { MessageEmbed } = require('discord.js');
const profileSchema = require('../../models/profile-schema');
const { profiles } = require('./profile');

const runCode = async (
	guildId,
	authorId,
	section,
	args,
	message,
	interaction
) => {
	// Seeing if their information is stored in local memory
	let data = profiles.find(
		(value) => value.guildId === guildId && value.authorId === authorId
	); // Seeing if their information is stored in local memory
	if (!data) {
		let newResults = await profileSchema.findOne({
			// Seeing if their information is in the database
			guildId,
			userId: authorId,
		});

		if (!newResults) {
			newResults = await profileSchema.create({
				// Making a file with their information
				guildId,
				userId: authorId,
				coins: 0,
				nickname: 'None',
				aboutMe: 'None',
			});
		}

		data = profiles[guildId && authorId] = newResults; // Either or, saving it to our "data" variable
	}

	let { coins, nickname, aboutMe } = data;

	// If they wrote "nickname" as their first argument
	if (section.toLowerCase() === 'nickname') {
		nickname = args.join(' ');
	} else if (section.toLowerCase() === 'aboutme') {
		aboutMe = args.join(' ');
	}
	// If it's a slash command get rid of their first argument (It's done already for legacy commands)
	if (interaction) {
		args.shift();
	}
	// Updating their file in the database
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
	);
	// Finding their file in the database (we know it exists)
	const result = await profileSchema.findOne({
		guildId,
		userId: authorId,
	});
	// Assigning their profile to our "data" variable
	data = profiles[guildId && authorId] = result;

	const username = message
		? message.author.username
		: interaction.user.username;

	const text = `*Nickname:* **${nickname}**
*About Me*: **${aboutMe}**`;

	const embed = new MessageEmbed().setAuthor(username).setDescription(text);

	return embed;
};

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
		const guildId = message ? message.guild.id : interaction.guild.id;
		const authorId = message ? message.author.id : interaction.user.id;

		const section = message
			? args.shift(' ')
			: interaction.options.getString('section');
		if (section.toLowerCase() === 'nickname') {
			return runCode(guildId, authorId, section, args, message, interaction);
		} else if (section.toLowerCase() === 'aboutme') {
			return runCode(guildId, authorId, section, args, message, interaction);
		} else {
			return 'Please use one of the following for your first parameter: nickname, aboutme.';
		}
		// ^^^ Seeing if they typed either "nickname", or "aboutme". If they did, then run the code
	},
};
