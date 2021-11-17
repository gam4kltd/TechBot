module.exports = {
    category: 'Misc',
    description: 'Simulates a join.',

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    maxArgs: 0,

    callback: ({ member, client }) => {
        client.emit('guildMemberAdd', member)
        return {
            custom: true,
            content: 'Join Simulated',
            ephemeral: true
        }
    }
}