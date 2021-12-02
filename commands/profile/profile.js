const profileSchema = require('../../models/profile-schema');
const { MessageEmbed } = require('discord.js');
const profiles = [];

module.exports = {
	category: 'Profile',
	description:
		'Either displays your profile or a command to set a profile property',

	slash: 'both',
	// testOnly: true,
	guildOnly: true,

	maxArgs: 0,

	callback: async ({ message, interaction }) => {
		const guildId = message ? message.guild.id : interaction.guild.id;
		const authorId = message ? message.author.id : interaction.user.id;
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
		const { nickname, aboutMe, coins } = data;

		const username = message
			? message.author.username
			: interaction.user.username;

		const text = `*Nickname:* **${nickname}**
*About Me*: **${aboutMe}**
*Coins*: **${coins}**`;
		const embed = new MessageEmbed().setAuthor(username).setDescription(text);

		return embed;
	},
};

module.exports.profiles = profiles;
