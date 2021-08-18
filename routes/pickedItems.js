const router = require('express').Router();
const { PickedItem } = require('../db/models/index');

router.get('/', async (req, res) => {
	const pickedItems = await PickedItem.findAll();
	res.send(pickedItems);
});

router.get('/:id', async (req, res) => {
	let pickedItem = await PickedItem.findByPk(req.params.id);
	res.send(pickedItem);
});

module.exports = router;
