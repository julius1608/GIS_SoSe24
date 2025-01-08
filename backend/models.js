const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
	name: String,
	age: Number,
	height: String,
	position: String,
	foot: String,
	nationality: String,
	caps: Number,
	goals: Number,
	club: String,
	since: String,
	value: String,
	image: String,
}, { timestamps: true });
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
