module.exports = {
    category: 'Misc',
    description: 'Replies with pong.',

    maxArgs: 0,

    callback: ({ message }) => {
        message.reply('Pong')
    }
}