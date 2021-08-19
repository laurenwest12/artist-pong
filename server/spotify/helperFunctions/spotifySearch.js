const axios = require('axios');
const querystring = require('querystring');

const getSpotifyData = async (name, type) => {
	let query = querystring.stringify({
		q: name,
		type,
		limit: 1,
	});

	if (name === 'MØ') {
		query = querystring.stringify({
			q: name,
			type,
			limit: 10,
		});
	}

	let data;

	try {
		res = await axios.get(`https://api.spotify.com/v1/search?${query}`);
		data = res.data;
		if (name === 'MØ') {
			data.artists.items = data.artists.items.filter(
				(item) => item.name === 'MØ'
			);
		}
	} catch (err) {
		console.log(err.response);
	}
	return data;
};

module.exports = getSpotifyData;
