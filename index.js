const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT || 8888;
const dotenv = require('dotenv').config();

const syncAndSeed = require('./db/seed');
const { getSpotifyData } = require('./spotify/helperFunctions/spotifySearch');

const auth = require('./routes/auth');

app.use(
	session({
		secret: 'this will be better later',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', auth);

app.get('/', async (req, res) => {
	if (!req.session.access_token) {
		res.redirect('/login');
	} else {
		//Add authorization token to axios calls
		let token = req.session.access_token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

		const artists = syncAndSeed();
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
					spotify: spotifyArtist[0].name,
				});
			}
		}
		res.send(mismatchingArtists);
	}

	//res.send(result['Sheet1'].slice(1));
});

app.listen(PORT, async () => {
	console.log('App is listening...');
	syncAndSeed();
});
