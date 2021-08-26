const router = require('express').Router();
const { Op } = require('sequelize');
const { sortArtists, sortNames } = require('../utils/sort');
const { Artist, PickedItem } = require('../db/models/index');

const addAdditionalAttributes = (sortedArtists) => {
	let artists = [];
	for (let i = 0; i < sortedArtists.length; ++i) {
		let artist = sortedArtists[i].dataValues;
		let pickedItems = artist.pickedItems.map((item) => item.dataValues);
		let lastCall = pickedItems.filter((item) => item.lastCall);
		let avgSongs =
			Math.round(
				(100 *
					pickedItems.reduce((acc, item) => {
						acc += item.numSongs;
						return acc;
					}, 0)) /
					pickedItems.length
			) / 100;
		let avgPick =
			Math.round(
				(100 *
					pickedItems.reduce((acc, item) => {
						acc += item.pickNumber;
						return acc;
					}, 0)) /
					pickedItems.length
			) / 100;
		let shared = pickedItems.filter((item) => item.userId === 5).length;
		artist.pickedItems = pickedItems;
		artists.push({
			...artist,
			avgSongs,
			avgPick,
			shared,
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
	let artistsParams = [];

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
	}

	const artistsRes = await Artist.findAll({
		where: {
			[Op.or]: artistsParams,
		},
		include: PickedItem,
	});
	const sortedArtists = artistsRes.sort(sortArtists('name', true));
	const artists = addAdditionalAttributes(sortedArtists);

	res.send(artists);
});

router.get('/:id', async (req, res) => {
	const artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
