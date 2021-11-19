module.exports = {
    category: 'Moderation',
    description: 'Deletes multiple messages at once.',

    requireRoles: true,

    maxArgs: 1,
    expectedArgs: '[amount]',

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: async ({ message, interaction, channel, args }) => {
        const amount = args.length ? (isNaN(args[0]) ? -1 : parseInt(args.shift())): 10

        if (amount <= 0) {
            return {
                custom: true,
                content: 'Invalid number of deletions',
                ephemeral: true
            }
        }

        if (message) {
            await message.delete()
        }

        const { size } = await channel.bulkDelete(amount, true)

        const reply = `Deleted ${size} message${amount === 1 ? '' : 's'}`

        if (interaction) {
            return reply
        }

        channel.send(reply)
    }
}