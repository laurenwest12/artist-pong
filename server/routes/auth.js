const router = require('express').Router();
const request = require('request');
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

router.get('/refresh_token', (req, res) => {
	let refresh_token = req.query.refresh_token;
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			Authorization:
				'Basic ' +
				Buffer.from(client_id + ':' + client_secret).toString('base64'),
		},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token,
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			let access_token = body.access_token;
			res.send({
				access_token: access_token,
			});
		}
	});
});

module.exports = router;
