const punishmentSchema = require('../../models/punishment-schema');

module.exports = {
	category: 'Moderation',
	description: 'Bans a user.',

	requireRoles: true,

	minArgs: 3,
	expectedArgs: '<user> <duration> <reason>',
	expectedArgsTypes: ['USER', 'STRING', 'STRING'],

	slash: 'both',
	testOnly: true,

	callback: async ({
		args,
		member: staff,
		guild,
		client,
		message,
		interaction,
	}) => {
		if (!guild) {
			return {
				custom: true,
				content: 'You can only use this in a server.',
				ephemeral: true,
			};
		}

		let userId = args.shift();
		const duration = args.shift();
		const reason = args.join(' ');
		let user = message
			? message.mentions.users.first()
			: interaction.options.getUser('user');

		if (!user) {
			userId = userId.replace(/[<@!>]/g, '');
			user = await client.users.fetch(userId);

			if (!user) {
				return `Could not find a user with the ID "${userId}"`;
			}
		}

		userId = user.id;

		let time;
		let type;

		try {
			const split = duration.match(/\d+|\D+/g);
			time = parseInt(split[0]);
			type = split[1].toLowerCase();
		} catch (e) {
			return {
				custom: true,
				content:
					"Invalid time format. Example format: \"10d\" where 'd' = days, 'h' = hours and 'm' = minutes.",
				ephemeral: true,
			};
		}

		if (type === 'h') {
			time *= 60;
		} else if (type === 'd') {
			time *= 60 * 24;
		} else if (type !== 'm') {
			return {
				custom: true,
				content:
					'Please use "m", "h", or "d" for minutes, hours, and days respectively.',
				ephemeral: true,
			};
		}

		const expires = new Date();
		expires.setMinutes(expires.getMinutes() + time);

		const result = await punishmentSchema.findOne({
			guildId: guild.id,
			userId,
			type: 'ban',
		});
		if (result) {
			return `<@${userId}> is already banned in this server.`;
		}

		try {
			await guild.members.ban(userId, { days: 7, reason });

			await new punishmentSchema({
				userId,
				guildId: guild.id,
				staffId: staff.id,
				reason,
				expires,
				type: 'ban',
			}).save();
		} catch (ignored) {
			return {
				custom: true,
				content: 'Cannot ban that user.',
				ephemeral: true,
			};
		}

		return {
			custom: true,
			content: `<@${userId}> has been banned for "${duration}"`,
		};
	},
};
