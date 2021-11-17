const actions = ['give', 'remove', 'has']

module.exports = {
    category: 'Moderation',
    description: 'Either gives, takes, or checks if someone has a certain role.',

    requireRole: true,

    minArgs: 3,
    expectedArgs: `<"${actions.join('", "')}"> <user @> <role @>`,

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: 'action',
            description: `The action to perform. One of: ${actions.join(', ')}`,
            type: 'STRING',
            required: true,
            choices: actions.map((action) => ({
                name: action,
                value: action
            }))
        }, 
        {
            name: 'user',
            description: 'The user to perform the action on.',
            type: 'USER',
            required: true
        },
        {
            name: 'role',
            description: 'The role to perform the action with.',
            type: 'ROLE',
            required: true
        }
    ],

    callback: ({ guild, args }) => {
        const action = args.shift()
        if (!action || !actions.includes(action)) {
            return `Unknown action! Please use one of the following: ${actions.join(', ')}`
        }

        const memberId = args.shift().replace(/[<@!&>]/g, '')
        const roleId = args.shift().replace(/[<@!&>]/g, '')

        const member = guild.members.cache.get(memberId)
        const role = guild.roles.cache.get(roleId)

        if (!member) {
            return `Could not find member with ID ${memberId}`
        }

        if (!role) {
            return `Could not find role with ID ${roleId}`
        }

        if (action === 'has') {
            return member.roles.cache.has(roleId) 
                ? `User has role "${role.name}"`
                : `User does not have role "${role.name}"`
        }

        if (action === 'give') {
            member.roles.add(role)
            return 'Role given.'
        }

        if (action === 'remove') {
            member.roles.remove(role)
            return 'Role removed'
        }
        
        return 'Unknown action.'
    }
}