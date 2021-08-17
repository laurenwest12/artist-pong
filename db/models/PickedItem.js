const Sequelize = require('Sequelize');
const db = require('../db');

const PickedItem = db.define('pickedItem', {
	lastCall: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	numSongs: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
});

module.exports = PickedItem;
