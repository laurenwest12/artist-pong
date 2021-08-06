const axios = require('axios');
const querystring = require('querystring');

const getSpotifyData = async (name, type) => {
	let query = querystring.stringify({
		q: name,
		type,
	});

	const { data } = await axios.get(
		`https://api.spotify.com/v1/search?${query}`
	);

	return data;
};

module.exports = { getSpotifyData };
