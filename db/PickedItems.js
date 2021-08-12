const admin = require('firebase-admin');

const { db } = require('./db');
const {
	getReferenceObj,
	addPickedItemsReferences,
} = require('./helperFunctions/references');

const createPickedItems = async (arr) => {
	let pick = 1;
	for (let i = 0; i < arr.length; ++i) {
		let current = arr[i];
		let pong = current['A'];
		let artist = current['B'];
		let user = current['D'];
		let numSongs = current['E'];
		let lastCall = current['I'] ? 'Y' : 'N';
		let id;

		//Find the # of pick in pong for each picked item
		if (i !== 0) {
			const previous = arr[i - 1];
			if (previous['A'] !== current['A']) {
				pick = 1;
			} else {
				pick++;
			}
		}

		id = `${pong}-${pick}-${user}`;

		const data = {
			pong: db.doc('Pong/' + pong),
			artist: db.doc('Artist/' + artist),
			user: db.doc('User/' + user),
			numSongs,
			lastCall,
		};

		await db.collection('PickedItems').doc(id).set(data);
	}
	console.log('Picked items created');
};

const deletePickedItems = async () => {
	const pickedItemsRef = db.collection('PickedItems');
	const pickedItemsSnap = await pickedItemsRef.get();

	pickedItemsSnap.forEach(async (doc) => {
		await db
			.collection('PickedItems')
			.doc(doc.id)
			.delete()
			.then(() => {
				console.log('Document successfully deleted!');
			})
			.catch((error) => {
				console.error('Error removing document: ', error);
			});
	});
};

const updatePickedItems = async (arr) => {
	arr.forEach(async (item) => {
		const pong = item['A'];
		const user = item['D'];
		const numSongs = item['E'];

		const id = `${pong}-${user}-${numSongs}`;

		const docRef = db.collection('PickedItems').doc(id);

		const res = await docRef.update({
			lastCall: item['I'] ? 'Y' : 'N',
		});
	});
	console.log('Picked items updated');
};

const addPickedItems = async () => {
	const pickedItemsRef = db.collection('PickedItems');
	const pickedItemsSnap = await pickedItemsRef.get();

	pickedItemsSnap.forEach(async (doc) => {
		const id = doc.id;
		await addPickedItemsReferences('PickedItems', id, 'artist', 'Artist');
		await addPickedItemsReferences('PickedItems', id, 'pong', 'Pong');
		await addPickedItemsReferences('PickedItems', id, 'user', 'User');
	});
};

module.exports = {
	createPickedItems,
	deletePickedItems,
	updatePickedItems,
	addPickedItems,
};
