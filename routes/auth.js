const router = require('express').Router();
const fetch = require('node-fetch');
const { encodeFormData } = require('../helperFunctions/encodeFormData');
const querystring = require('querystring');
const { client_id, redirect_uri, client_secret, scope } = require('../config');

router.get('/login', async (req, res) => {
	res.redirect(
		`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&show_dialog=true`
	);
});

router.get('/callback', async (req, res) => {
	let body = {
		grant_type: 'authorization_code',
		code: req.query.code,
		redirect_uri,
		client_id,
		client_secret,
	};

	await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		body: encodeFormData(body),
	})
		.then((resp) => resp.json)
		.then((data) => {
			let query = querystring.stringify(data);
			res.redirect(`http://localhost:8888/${query}`);
		});
});

module.exports = router;
