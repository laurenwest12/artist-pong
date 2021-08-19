const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
});

module.exports = User;
