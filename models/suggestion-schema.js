const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const suggestionSchema = mongoose.Schema({
    // Guild ID
    _id: reqString,
    channelId: reqString
})

const name = 'suggestion-channels'

module.exports = mongoose.models[name] || mongoose.model(name, suggestionSchema)