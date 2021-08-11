const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT || 8888;

const auth = require('./routes/auth');

app.use(
	session({
		secret: 'this will be better later',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', auth);

//Data that was stored in an Excel doc
const excelToJson = require('convert-excel-to-json');
const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

app.get('/', async (req, res) => {
	if (!req.session.access_token) {
		res.redirect('/login');
	} else {
		//Add authorization token to axios calls
		let token = req.session.access_token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

		res.send('Hello World');
	}
});

app.listen(PORT, async () => {
	console.log('App is listening...');
	// const pongNames = getPongNames(result['Sheet1']);
	// const artistNames = getArtistNames(result['Sheet1']);
});
