const Sequelize = require('sequelize');
const db = require('../db');

const Pong = db.define('pong', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	number: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	lastCall: {
		type: Sequelize.BOOLEAN,
		defaulValue: false,
	},
});

module.exports = Pong;
