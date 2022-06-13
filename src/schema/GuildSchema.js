const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	config = require("../config")

module.exports = mongoose.model("ganyuguilds",
	new Schema({
		id: { type: String, unique: true },
		prefix: { type: String, default: config.prefix },
		ocrapi : { type: String, default: null }
	}),
)
