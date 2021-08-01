const express = require('express');
const app = express();

const { getArtistNames } = require('./db/Artist');
const { getPongNames, createPongs, deletePongs } = require('./db/Pong');

//Data that was stored in an Excel doc
const excelToJson = require('convert-excel-to-json');
const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

app.listen(8888, async () => {
	console.log('App is listening...');
	const pongNames = getPongNames(result['Sheet1']);
	const artistNames = getArtistNames(result['Sheet1']);
	createPongs(pongNames);
});
