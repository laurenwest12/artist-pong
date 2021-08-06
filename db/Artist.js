const { db } = require('./db');
const { getSpotifyData } = require('../helperFunctions/spotifySearch');

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

const getSpotifyArtistData = async (arr) => {
	const pArray = await arr.map(async (artist) => {
		const spotifyData = await getSpotifyData(artist, 'artist');
		const firstResult = spotifyData.artists.items[0];
		return {
			dbName: artist,
			spotifyName: firstResult && firstResult.name,
			id: firstResult && firstResult.id,
		};
	});
	const shopifyData = await Promise.all(pArray).then((data) => data);
	return shopifyData;
};

module.exports = {
	getArtistNames,
	createArtists,
	getArtistsFromDb,
	getSpotifyArtistData,
};
