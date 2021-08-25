const router = require('express').Router();
const { Op } = require('sequelize');
const { sortArtists } = require('../utils/sort');
const { Artist, PickedItem } = require('../db/models/index');

router.get('/', async (req, res) => {
	const artistsRes = await Artist.findAll({
		include: PickedItem,
	});
	const sortedArtists = artistsRes.sort(sortArtists('name', true));

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

	res.send(artists);
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
		include: PickedItem,
	});

	res.send(artists);
});

router.get('/:id', async (req, res) => {
	let artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
