const welcomeSchema = require('../models/welcome-schema');

// 1. Load all the data when the bot starts up
// 2. Load and store the data only when needed

const welcomeData = {}; // guildId: [channel, message]

module.exports = (client) => {
	client.on('guildMemberAdd', async (member) => {
		const { guild, id } = member;

		let data = welcomeData[guild.id];

		if (!data) {
			const results = await welcomeSchema.findById(guild.id);
			if (!results) {
				return;
			}

			const { channelId, text } = results;
			const channel = guild.channels.cache.get(channelId);
			data = welcomeData[guild.id] = [channel, text];
		}

		data[0].send({
			content: data[1].replace(/@/g, `<@${id}>`),
		});
	});
};

module.exports.welcomeData = welcomeData;

module.exports.config = {
	displayName: 'Welcome Message',
	dbName: 'WELCOME_MESSAGE',
};
