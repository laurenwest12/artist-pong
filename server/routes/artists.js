const router = require('express').Router();
const { Op } = require('sequelize');
const { sortArtists, sortNames } = require('../utils/sort');
const { Artist, PickedItem, User } = require('../db/models/index');

const addAdditionalAttributes = (sortedArtists) => {
	let artists = [];
	for (let i = 0; i < sortedArtists.length; ++i) {
		const artist = sortedArtists[i].dataValues;
		const pickedItems = artist.pickedItems.map((item) => item.dataValues);
		const lastCall = pickedItems.filter((item) => item.lastCall);
		const avgSongs =
			Math.round(
				(100 *
					pickedItems.reduce((acc, item) => {
						acc += item.numSongs;
						return acc;
					}, 0)) /
					pickedItems.length
			) / 100;
		const avgPick =
			Math.round(
				(100 *
					pickedItems.reduce((acc, item) => {
						acc += item.pickNumber;
						return acc;
					}, 0)) /
					pickedItems.length
			) / 100;
		const shared = pickedItems.filter((item) => item.userId === 5).length;
		artist.pickedItems = pickedItems;

		const pickedBy = pickedItems.reduce((acc, item) => {
			!acc.includes(item.userId) && acc.push(item.userId);
			return acc;
		}, []);

		artists.push({
			...artist,
			avgSongs,
			avgPick,
			shared,
			pickedBy,
		});
	}
	return artists;
};

router.get('/', async (req, res) => {
	const artistsRes = await Artist.findAll({
		include: PickedItem,
	});
	const sortedArtists = artistsRes.sort(sortArtists('name', true));
	const artists = addAdditionalAttributes(sortedArtists);

	res.send(artists);
});

router.get('/names', async (req, res) => {
	const artists = await Artist.findAll();
	const artistNames = artists.map((artist) => artist.name);
	const sortedNames = artistNames.sort(sortNames);
	res.send(sortedNames);
});

router.get('/filtered?', async (req, res) => {
	const query = req.query;
	let artists;
	let artistsParams = [];

	console.log(req.query);

	if (query.name) {
		if (Array.isArray(query.name)) {
			query.name.map((artist) => {
				artistsParams.push({
					name: artist,
				});
			});
		} else {
			artistsParams.push({
				name: query.name,
			});
		}
		const artistsRes = await Artist.findAll({
			where: {
				[Op.or]: artistsParams,
			},
			include: PickedItem,
		});
		const sortedArtists = artistsRes.sort(sortArtists('name', true));
		artists = addAdditionalAttributes(sortedArtists);
	} else {
		const artistsRes = await Artist.findAll({
			include: PickedItem,
		});
		const sortedArtists = artistsRes.sort(sortArtists('name', true));
		artists = addAdditionalAttributes(sortedArtists);
	}

	if (query.user) {
		artists = artists.filter((artist) => artist.includes(query.user));
	}

	res.send(artists);
});

router.get('/:id', async (req, res) => {
	const artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
