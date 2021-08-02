const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8888;
const auth = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', auth);

//Database information
const { getArtistNames } = require('./db/Artist');
const { getPongNames, createPongs, deletePongs } = require('./db/Pong');

//Spotify calls
const { searchArtist, authorizationURL } = require('./spotify/spotify');

//Data that was stored in an Excel doc
const excelToJson = require('convert-excel-to-json');
const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

app.listen(PORT, async () => {
	console.log('App is listening...');
	// const pongNames = getPongNames(result['Sheet1']);
	// const artistNames = getArtistNames(result['Sheet1']);
	console.log(authorizationURL);
});
