const Sequelize = require('sequelize');
const db = require('../db');

const Artist = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	genre: {
		type: Sequelize.ARRAY(Sequelize.TEXT),
		allowNull: false,
		defaultValue: [],
	},
	followers: {
		type: Sequelize.BIGINT,
		allowNull: false,
		defaultValue: 0,
	},
	spotifyId: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: '',
	},
	images: {
		type: Sequelize.ARRAY(),
	},
	popularity: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});

module.exports = Artist;
