const { db } = require('./db');
const { getReferenceId } = require('./helperFunctions/getReferences');

const createPickedItems = (arr) => {
	arr.forEach((item) => {
		let pong = item['A'];
		let artist = item['B'];
		let user = item['D'];
		let numSongs = item['E'];

		let data = {
			pong: db.doc('Pong/' + pong),
			artist: db.doc('Artist/' + artist),
			user: db.doc('User/' + user),
			numSongs,
			lastCall: item['I'] ? 'Y' : 'N',
		};

		db.collection('PickedItems')
			.doc(`${pong}-${user}-${numSongs}`)
			.set(data);
	});
	console.log('Picked Items created');
};

const updatePickedItems = async (arr) => {
	arr.forEach(async (item) => {
		let pong = item['A'];
		let user = item['D'];
		let numSongs = item['E'];

		let id = `${pong}-${user}-${numSongs}`;

		let docRef = db.collection('PickedItems').doc(id);

		const res = await docRef.update({
			lastCall: item['I'] ? 'Y' : 'N',
		});
	});
	console.log('Picked items updated');
};

const updateOtherCollections = async (arr) => {
	arr.forEach(async (item) => {
		let pong = item['A'];
		let user = item['D'];
		let numSongs = item['E'];

		let id = `${pong}-${user}-${numSongs}`;

		const artistId = await getReferenceId(
			'PickedItems',
			id,
			'artist',
			'Artist'
		);
		console.log(artistId);
		// let docRef = db.collection('PickedItems').doc(id);
		// const snapshot = await docRef.get();

		// console.log(snapshot.data());
	});
};

module.exports = {
	createPickedItems,
	updatePickedItems,
	updateOtherCollections,
};
