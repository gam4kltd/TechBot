const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const pollSchema = new mongoose.Schema({
    // Guild ID
    _id: reqString,
    channelId: reqString
})

const name = 'poll-channels'
module.exports = mongoose.models[name] || mongoose.model(name, pollSchema, name)