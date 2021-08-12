const admin = require('firebase-admin');

const { db } = require('./db');
const { getReferenceObj } = require('./helperFunctions/getReferences');

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

	let data = [];

	pickedItemsSnap.forEach(async (doc) => {
		// const id = doc.id;
		data.push({
			id: doc.id,
			...doc.data(),
		});
		// const data = doc.data();

		// const artist = await getReferenceObj(
		// 	'PickedItems',
		// 	id,
		// 	'artist',
		// 	'Artist'
		// );
		// console.log(artist);
	});

	data.slice(0, 1).forEach(async (doc) => {
		const { id } = doc;

		const artist = await getReferenceObj(
			'PickedItems',
			id,
			'artist',
			'Artist'
		);

		let artistPickedItems;
		if (artist.pickedItems) {
			let ids = artist.pickedItems.map((item) => item.id);
			if (!ids.includes(id)) {
				artistPickedItems = [
					...artist.pickedItems,
					db.doc(`PickedItems/${id}`),
				];
			}
		} else {
			artistPickedItems = [db.doc(`PickedItems/${doc}`)];
		}

		if (artistPickedItems) {
			const artistRef = db.collection('Artist').doc(artist.collectionId);
			await artistRef.update({
				pickedItems: artistPickedItems,
			});
		}
	});

	// arr.forEach(async (item) => {
	// 	const pong = item['A'];
	// 	const user = item['D'];
	// 	const numSongs = item['E'];

	// 	const id = `${pong}-${user}-${numSongs}`;

	// 	const artistObj = await getReferenceObj(
	// 		'PickedItems',
	// 		id,
	// 		'artist',
	// 		'Artist'
	// 	);

	// 	const artistRef = db.collection('Artist').doc(artistObj.collectionId);

	// 	const artistRes = await artistRef.update({
	// 		pickedItems: [...artistObj['pickedItems'], id],
	// 	});

	// 	// const artistId = await getReferenceId(
	// 	// 	'PickedItems',
	// 	// 	id,
	// 	// 	'artist',
	// 	// );
	// 	// const artistRef = db.collection('Artist').doc(artistId);
	// 	// console.log(id);
	// 	// const artistRes = await artistRef.update({
	// 	// 	pickedItems: admin.firestore.FieldValue.arrayUnion(pickedItem),
	// 	// });

	// 	// const pongId = await getReferenceId('PickedItems', id, 'pong', 'Pong');

	// 	// const userId = await getReferenceId('PickedItems', id, 'user', 'User');
	// 	// let docRef = db.collection('PickedItems').doc(id);
	// 	// const snapshot = await docRef.get();

	// 	// console.log(snapshot.data());
	// });
};

module.exports = {
	createPickedItems,
	deletePickedItems,
	updatePickedItems,
	addPickedItems,
};
