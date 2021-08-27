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

const addPickedNumber = () => {
	let pickNum = 1;
	data.forEach((row, index) => {
		if (index === 0) {
			row['J'] = pickNum;
			pickNum++;
		} else {
			let previousRow = data[index - 1];
			let currentPong = row['A'];
			let previousPong = previousRow['A'];
			if (currentPong !== previousPong) {
				pickNum = 1;
			}
			row['J'] = pickNum;
			pickNum++;
		}
	});
};

const getPickedItems = async () => {
	addPickedNumber();
	const pickedItemsDataPromises = data.map(async (row) => {
		const currentPong = row['A'];
		const currentArtist = row['B'];
		const currentUser = row['D'];
		const numSongs = row['E'];
		const lastCall = row['I'];
		const pickNum = row['J'];

		const artistRes = await Artist.findByPk(currentArtist);
		const artist = artistRes.dataValues;

		const pongRes = await Pong.findAll({
			where: {
				name: currentPong,
			},
		});
		const pong = pongRes[0].dataValues;

		const userRes = await User.findAll({
			where: {
				username: currentUser,
			},
		});
		const user = userRes[0].dataValues;

		let pickedItem = {
			lastCall: lastCall === 'Y',
			numSongs,
			pickNumber: pickNum,
			artistName: artist.name,
			pongId: pong.id,
			userId: user.id,
		};

		return pickedItem;
	});

	const pickedItemsData = await Promise.all(pickedItemsDataPromises).then(
		(data) => data
	);
	return pickedItemsData;
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

		if (spotifyData && spotifyData.name === artist) {
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
			console.log('creating users')
			return createInstances(User, usersData);
		})
		.then(async () => {
			console.log('creating pongs')
			return createInstances(Pong, pongsData);
		})
		.then(async () => {
			console.log('creating artists')
			return createInstances(Artist, artistsData);
		})
		.then(async () => {
			const pickedItems = await getPickedItems();
			console.log('creating picked items')
			return createInstances(PickedItem, pickedItems);
		});
};

const dbSync = () => {
	return db.authenticate().then(() => db.sync({ force: false }));
};

module.exports = {
	syncAndSeed,
	dbSync,
};
