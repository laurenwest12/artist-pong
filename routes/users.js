const router = require('express').Router();
const { User } = require('../db/models/index');

router.get('/', async (req, res) => {
	const users = await User.findAll();
	res.send(users);
});

router.get('/:id', async (req, res, next) => {
	let user = await User.findByPk(req.params.id);
	res.send(user);
});

module.exports = router;
