const router = require('express').Router();
const { Pong } = require('../db/models/index');

router.get('/', async (req, res) => {
	const pongs = await Pong.findAll();
	res.send(pongs);
});

router.get('/:id', async (req, res) => {
	let pong = await Pong.findByPk(req.params.id);
	res.send(pong);
});

module.exports = router;
