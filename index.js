const express = require('express');
const app = express();
const firebase = require('firebase');
const excelToJson = require('convert-excel-to-json');

const { firebaseConfig, apiKey } = require('./config');
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

const getPongNames = (arr) => {
	const uniqueNames = arr.reduce((acc, obj) => {
		let pong = obj['A'];
		if (pong.indexOf('Pong') === -1) {
			pong += ' Pong';
		}
		!acc.includes(pong) && acc.push(pong);
		return acc;
	}, []);
	return uniqueNames;
};

const createPongs = (arr) => {
	arr.forEach((item, index) => {
		db.collection('Pong').doc(item).set({
			name: item,
			number: index,
		});
	});
};

const deletePongs = (arr) => {
	arr.forEach((item) => {
		db.collection('Pong')
			.doc(item)
			.delete()
			.then(() => {
				console.log('Document successfully deleted!');
			})
			.catch((error) => {
				console.error('Error removing document: ', error);
			});
	});
};

const getArtistNames = (arr) => {
	const uniqueNames = arr.reduce((acc, obj) => {
		let artist = obj['B'];
		!acc.includes(artist) && acc.push(artist);
		return acc;
	}, []);
	return uniqueNames;
};

app.listen(8080, async () => {
	console.log('App is listening...');
	const pongNames = getPongNames(result['Sheet1']);
	const artistNames = getArtistNames(result['Sheet1']);
});
