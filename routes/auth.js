const router = require('express').Router();
const { response } = require('express');
const request = require('request');
// const querystring = require('querystring');
const { client_id, redirect_uri, client_secret, scope } = require('../config');

router.get('/login', async (req, res) => {
	res.redirect(
		`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&show_dialog=true`
	);
});

router.get('/callback', async (req, res) => {
	let code = req.query.code;

	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code',
		},
		headers: {
			Authorization:
				'Basic ' +
				Buffer.from(client_id + ':' + client_secret).toString('base64'),
		},
		json: true,
	};

	request.post(authOptions, (err, response, body) => {
		if (!err && response.statusCode === 200) {
			let access_token = body.access_token;
			let refresh_token = body.access_token;
			req.session.access_token = access_token;
			req.session.refresh_token = refresh_token;
			res.redirect('/');
		} else {
			console.log(err);
		}
	});
});

module.exports = router;
