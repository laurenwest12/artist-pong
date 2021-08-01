const { db } = require('./db');

const getArtistNames = (arr) => {
	const uniqueNames = arr.reduce((acc, obj) => {
		let artist = obj['B'];
		!acc.includes(artist) && acc.push(artist);
		return acc;
	}, []);
	return uniqueNames;
};

module.exports = {
	getArtistNames,
};
