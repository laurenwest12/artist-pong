const express = require('express');
const app = express();
const firebase = require('firebase');
const excelToJson = require('convert-excel-to-json');

const { firebaseConfig, apiKey } = require('./config');
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
// db.collection('Pong').doc('BlackPong1.0').set({
// 	name: 'Black Pong 1.0',
// });

const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

app.listen(8080, async () => {
	console.log('App is listening...');
	console.log(result);
});
