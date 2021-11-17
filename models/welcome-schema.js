const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const welcomeSchema = new mongoose.Schema({
    // Guild ID
    _id: reqString,
    channelId: reqString,
    text: reqString
})

const name = 'welcome-message'
module.exports = mongoose.models[name] || mongoose.model(name, welcomeSchema, name)