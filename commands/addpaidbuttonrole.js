const { MessageActionRow, MessageButton } = require('discord.js');
const profileSchema = require('../models/profile-schema');
const { profiles } = require('./profile/profile');

module.exports = {
	category: 'Configuration',
	description: 'Adds a role that needs to be paid for with coins.',

	slash: 'both',
	testOnly: true,
	guildOnly: true,

	minArgs: 4,
	expectedArgs: '<channel> <messageId> <role> <price>',
	expectedArgsTypes: ['CHANNEL', 'STRING', 'ROLE', 'STRING'],

	init: (client) => {
		client.on('interactionCreate', async (interaction) => {
			const guildId = interaction.guild.id;
			const authorId = interaction.user.id;

			if (!interaction.isButton()) {
				return;
			}

			let { customId: id } = interaction;
			const customId = id.split('---');

			const role = await interaction.guild.roles.cache.find(
				(role) => role.id === customId[0]
			);
			if (interaction.member.roles.cache.has(role.id)) {
				interaction.reply({
					content: 'You already have that role!',
					ephemeral: true,
				});
				return;
			}
			const split = customId[1].split('=');
			const price = split[1];
			console.log('Price: ' + price);

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
			let { coins: userBalance, nickname, aboutMe } = data;

			if (price > userBalance) {
				interaction.reply({
					content: `You need ${price} coins to purchase this role! You have ${userBalance} coins.`,
					ephemeral: true,
				});
				return;
			}

			interaction.member.roles.add(customId[0]);

			userBalance -= price;

			await profileSchema.findOneAndUpdate(
				{
					guildId,
					userId: authorId,
				},
				{
					guildId,
					userId: authorId,
					coins: userBalance,
					nickname,
					aboutMe,
				},
				{
					upsert: true,
				}
			);

			const profile = await profileSchema.findOne({
				guildId,
				userId: authorId,
			});

			data = profiles[(guildId, authorId)] = profile;
			interaction.reply({
				content: `Congradulations! Your new balance is ${userBalance} coins.`,
				ephemeral: true,
			});
		});
	},

	callback: async ({ message, interaction: msgInt, args, client }) => {
		const channel = message
			? message.channel
			: msgInt.options.getChannel('channel');
		if (!channel || channel.type !== 'GUILD_TEXT') {
			return {
				custom: true,
				content: 'Please tag a text channel.',
				ephemeral: true,
			};
		}
		const messageId = args[1];

		const role = message
			? message.mentions.roles.first()
			: msgInt.options.getRole('role');
		if (!role) {
			return {
				custom: true,
				content: `Unknown role.`,
				ephemeral: true,
			};
		}

		let targetMessage;
		try {
			targetMessage = await channel.messages.fetch(messageId, {
				cache: true,
				force: true,
			});
		} catch (e) {
			return "You either didn't specify the correct channel that the message is in or the message id is invalid.";
		}

		if (targetMessage.author.id !== client.user.id) {
			return {
				custom: true,
				content: `Please provide a message ID that was sent from <@${client.user.id}>`,
				ephemeral: true,
			};
		}

		const price = args[3];
		if (isNaN(price)) {
			return {
				custom: true,
				content: `The price your provided is not a number. Please provide a valid number.`,
				ephemeral: true,
			};
		}

		let row = targetMessage.components[0];
		if (!row) {
			row = new MessageActionRow();
		}

		row.addComponents(
			new MessageButton()
				.setCustomId(role.id + `---price=${price}`)
				.setLabel(role.name)
				.setStyle('PRIMARY')
		);

		let text = `${targetMessage}\n`;
		text += `${role.name} = ${price} coins`;

		console.log(text);

		targetMessage.edit({
			content: text,
			components: [row],
		});

		return {
			custom: true,
			content: `Added <@&${role.id}> to the paid roles menu`,
			allowedMentions: {
				roles: [],
			},
			ephemeral: true,
		};
	},
};
