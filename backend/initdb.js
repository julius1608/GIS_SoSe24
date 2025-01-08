const mongoose = require('mongoose');
const Player = require('./models');

mongoose.connect('mongodb://localhost:27017/sammelalbum')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function initDb() {
	console.log('Initializing database...');
	await Player.deleteMany({});
	const players = require('../players.json');
	for (const player of players) {
		const newPlayer = new Player({ ...player });
		await newPlayer.save();
	}
	console.log('Database initialized');
	mongoose.connection.close();
}
initDb();
