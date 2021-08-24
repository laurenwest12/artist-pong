const router = require('express').Router();
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

		artistsPickedItems.push({
			...artist,
			pickedItems,
			lastCall,
		});
	}
	res.send(artistsPickedItems);
});
router.get('/:id', async (req, res) => {
	let artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
