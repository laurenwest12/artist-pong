const router = require('express').Router();
const { Op } = require('sequelize');
const { sortArtists } = require('../utils/sort');
const { Artist, PickedItem } = require('../db/models/index');

router.get('/', async (req, res) => {
	const artists = await Artist.findAll();
	const sortedArtists = artists.sort(sortArtists('name', true));
	res.send(artists);
});

router.get('/pickedItems', async (req, res) => {
	const artists = await Artist.findAll();
	const sortedArtists = artists.sort(sortArtists('name', true));
	let artistsPickedItems = [];

	for (let i = 0; i < sortedArtists.length; ++i) {
		let artist = sortedArtists[i].dataValues;
		let pickedItems = await PickedItem.findAll({
			where: {
				artistName: artist.name,
			},
		});

		let lastCall = pickedItems.filter((item) => item.lastCall);
		let avgSongs =
			pickedItems.reduce((acc, item) => {
				acc += item.numSongs;
				return acc;
			}, 0) / pickedItems.length;
		let avgPick =
			pickedItems.reduce((acc, item) => {
				acc += item.pickNumber;
				return acc;
			}, 0) / pickedItems.length;

		artistsPickedItems.push({
			...artist,
			pickedItems,
			lastCall,
			avgSongs,
			avgPick,
		});
	}
	res.send(artistsPickedItems);
});

router.get('/filtered?', async (req, res) => {
	const query = req.query;
	let artistsParams = [];

	query.name &&
		query.name.map((artist) => {
			artistsParams.push({
				name: artist,
			});
		});

	const artists = await Artist.findAll({
		where: {
			[Op.or]: artistsParams,
		},
	});

	const sortedArtists = artists.sort(sortArtists('name', true));
	let artistsPickedItems = [];

	for (let i = 0; i < sortedArtists.length; ++i) {
		let artist = sortedArtists[i].dataValues;
		let pickedItems = await PickedItem.findAll({
			where: {
				artistName: artist.name,
			},
		});

		let lastCall = pickedItems.filter((item) => item.lastCall);
		let avgSongs =
			pickedItems.reduce((acc, item) => {
				acc += item.numSongs;
				return acc;
			}, 0) / pickedItems.length;
		let avgPick =
			pickedItems.reduce((acc, item) => {
				acc += item.pickNumber;
				return acc;
			}, 0) / pickedItems.length;

		artistsPickedItems.push({
			...artist,
			pickedItems,
			lastCall,
			avgSongs,
			avgPick,
		});
	}

	res.send(artistsPickedItems);
});

router.get('/:id', async (req, res) => {
	let artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
