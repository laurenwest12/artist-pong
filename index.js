const express = require('express');
const app = express();
const firebase = require('firebase');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const { firebaseConfig, apiKey } = require('./config');
firebase.initializeApp(firebaseConfig);

const getSheet = async () => {
	const doc = new GoogleSpreadsheet(
		'1gaWIF1j7vsrGlKdZKCceIn1pwI1MlJEw-tFBsDBNluo'
	);
	await doc.useApiKey(apiKey);
	await doc.loadInfo();
	console.log(doc.title);
};

const db = firebase.firestore();
// db.collection('Pong').doc('BlackPong1.0').set({
// 	name: 'Black Pong 1.0',
// });

app.listen(8080, async () => {
	console.log('App is listening...');
	await getSheet();
});
