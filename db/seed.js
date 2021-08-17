const db = require('./db');
const { Artist, PickedItem, Pong, User } = require('./models/index');

const excelToJson = require('convert-excel-to-json');
const getSpotifyData = require('../spotify/helperFunctions/spotifySearch');
const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

const data = result['Sheet1'].slice(1);

const getUniqueValues = (column) => {
	return data.reduce((acc, row) => {
		const artist = row[column];
		if (!acc.includes(artist)) {
			acc.push(artist);
		}
		return acc;
	}, []);
};

const createInstances = (model, data) => {
	return Promise.all(data.map((instance) => model.create(instance)));
};

const syncAndSeed = async () => {
	const artists = getUniqueValues('B');
	const users = getUniqueValues('D');

	const usersData = users.map((user) => {
		return {
			username: user,
			password: 'Brooklyn1',
		};
	});

	let pongNum = 0;
	const pongsData = data.reduce((acc, row, index) => {
		const pong = row['A'];
		const lastCall = row['H'];

		if (index === 0) {
			pongNum++;
			acc.push({
				name: pong,
				number: pongNum,
				lastCall: lastCall === 'Y',
			});
		}

		if (index > 0 && data[index - 1]['A'] !== pong) {
			pongNum++;
			acc.push({
				name: pong,
				number: pongNum,
				lastCall: lastCall === 'Y',
			});
		}
		return acc;
	}, []);

	let artistsData = [];

	for (let i = 0; i < artists.length; ++i) {
		let artist = artists[i];
		const spotifyRes = await getSpotifyData(artist, 'artist');

		let artistObj = {
			name: '',
			genres: [],
			followers: 0,
			spotifyId: '',
			images: [],
			popularity: 0,
		};

		let spotifyData = spotifyRes.artists.items[0];

		if (spotifyData) {
			let { name, genres, followers, id, images, popularity } =
				spotifyData;
			followers = followers.total;

			artistObj.name = name;
			artistObj.genres = genres;
			artistObj.followers = followers;
			artistObj.spotifyId = id;
			artistObj.images = images;
			artistObj.popularity = popularity;
		} else {
			artistObj.name = artist;
		}

		artistsData.push(artistObj);
	}

	return db
		.authenticate()
		.then(() => db.sync({ force: true }))
		.then(async () => {
			console.log('Authenticated');
			try {
				await createInstances(User, usersData);
			} catch (err) {
				console.log('Error creating users', err);
			}
		})
		.then(async () => {
			try {
				await createInstances(Pong, pongsData);
			} catch (err) {
				console.log('Error creating pongs', err);
			}
		})
		.then(async () => {
			try {
				await createInstances(Artist, artistsData);
			} catch (err) {
				console.log('Error creating artits', err);
			}
		});
};

module.exports = syncAndSeed;
