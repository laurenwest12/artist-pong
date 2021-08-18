const router = require('express').Router();
const { Artist } = require('../db/models/index');

router.get('/', async (req, res) => {
	const artists = await Artist.findAll();
	res.send(artists);
});

router.get('/:id', async (req, res, next) => {
	let artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
