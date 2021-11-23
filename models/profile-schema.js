const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true,
}

const profileSchema = new mongoose.Schema({
	guildId: reqString,
	userId: reqString,
	coins: {
		type: Number,
		default: 0,
	},
	nickname: {
		type: String,
		default: 'None',
	},
	aboutMe: {
		type: String,
		default: 'None',
	},
})

const name = 'profiles'

module.exports =
	mongoose.models[name] || mongoose.model(name, profileSchema, name)
