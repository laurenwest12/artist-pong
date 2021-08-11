const axios = require('axios');
const querystring = require('querystring');

const getSpotifyData = async (name, type) => {
	let query = querystring.stringify({
		q: name,
		type,
		limit: 1,
	});

	let data;

	try {
		res = await axios.get(`https://api.spotify.com/v1/search?${query}`);
		data = res.data;
	} catch (err) {
		console.log(err.response);
	}
	return data;
};

module.exports = { getSpotifyData };
