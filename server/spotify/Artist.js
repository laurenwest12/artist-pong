const Bottleneck = require('bottleneck/es5');

const { getSpotifyData } = require('./helperFunctions/spotifySearch');

const limiter = new Bottleneck({
	minTime: 100,
});

const getSpotifyArtistData = async (arr) => {
	const pArray = await arr.map(async (artist) => {
		const spotifyData = await limiter.schedule(() =>
			getSpotifyData(artist, 'artist')
		);
		const firstResult = spotifyData.artists.items[0];
		console.log(artist);
		return {
			dbName: artist,
			spotifyName: firstResult && firstResult.name,
			id: firstResult && firstResult.id,
			popularity: firstResult && firstResult.popularity,
			images: firstResult && firstResult.images,
			genres: firstResult && firstResult.genres,
			followers: firstResult && firstResult.followers,
		};
	});
	const spotifyData = await Promise.all(pArray).then((data) => data);
	return spotifyData;
};

module.exports = {
	getSpotifyArtistData,
};
