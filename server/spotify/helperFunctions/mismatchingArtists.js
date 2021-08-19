const getSpotifyData = require('./spotifySearch');

const findMismatchingArtists = (artists) => {
	const spotifyArtists = [];
	const mismatchingArtists = [];

	for (let i = 0; i < artists.length; ++i) {
		const artist = artists[i];
		const spotifyArtistRes = await getSpotifyData(artist, 'artist');
		const spotifyArtist = spotifyArtistRes.artists.items;
		spotifyArtists.push(spotifyArtist);

		if (spotifyArtist.length > 0 && spotifyArtist[0].name !== artist) {
			mismatchingArtists.push({
				excel: artist,
				spotify: spotifyArtist,
			});
		}
	}
	return mismatchingArtists;
};

module.exports = findMismatchingArtists;
