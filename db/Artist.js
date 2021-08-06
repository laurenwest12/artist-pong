const { db } = require('./db');

const getArtistNames = (arr) => {
	const uniqueNames = arr.reduce((acc, obj) => {
		let artist = obj['B'];
		!acc.includes(artist) && acc.push(artist);
		return acc;
	}, []);
	return uniqueNames;
};

const getArtistsFromDb = async () => {
	let artists = [];

	const artistsRef = db.collection('Artist');
	const snapshot = await artistsRef.get();
	snapshot.forEach((doc) => {
		const data = doc.data();
		artists.push(data.name);
	});

	return artists;
};

const createArtists = (arr) => {
	arr.forEach((item) => {
		if (item !== 'Artist') {
			db.collection('Artist').doc(item).set({
				name: item,
			});
		}
	});
	console.log('Artists created');
};

module.exports = {
	getArtistNames,
	createArtists,
	getArtistsFromDb,
};
