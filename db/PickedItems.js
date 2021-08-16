const admin = require('firebase-admin');

const { db } = require('./db');
const {
	getReferenceObj,
	addPickedItemsReferences,
	addPickedItemsById,
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

		//Find the # of pick in pong for each picked item
		if (i !== 0) {
			const previous = arr[i - 1];
			if (previous['A'] !== current['A']) {
				pick = 1;
			} else {
				pick++;
			}
		}

		if (pong.indexOf('Pong') === -1) {
			newPong = pong + ' Pong';

			let id = `${newPong}-${pick}-${user}`;

			const data = {
				pong: newPong,
				artist,
				user,
				numSongs,
				lastCall,
			};

			await db.collection('PickedItems').doc(id).set(data);
		} else {
			let id = `${pong}-${pick}-${user}`;

			const data = {
				pong,
				artist,
				user,
				numSongs,
				lastCall,
			};

			await db.collection('PickedItems').doc(id).set(data);
		}

		// //Find the # of pick in pong for each picked item
		// if (i !== 0) {
		// 	const previous = arr[i - 1];
		// 	if (previous['A'] !== current['A']) {
		// 		pick = 1;
		// 	} else {
		// 		pick++;
		// 	}
		// }
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

// const addPickedItems = async () => {
// 	const pickedItemsRef = db.collection('PickedItems');
// 	const pickedItemsSnap = await pickedItemsRef.get();
// 	let test = [];

// 	pickedItemsSnap.forEach((doc) => {
// 		test.push(doc);
// 	});

// 	test.forEach(async (doc) => {
// 		const id = doc.id;
// 		await addPickedItemsReferences('PickedItems', id, 'artist', 'Artist');
// 		await addPickedItemsReferences('PickedItems', id, 'pong', 'Pong');
// 		await addPickedItemsReferences('PickedItems', id, 'user', 'User');
// 	});
// };

const addPickedItems = async () => {
	const pickedItemsRef = db.collection('PickedItems');
	const pickedItemsSnap = await pickedItemsRef.get();
	let pickedItemsData = [];

	pickedItemsSnap.forEach((doc) => {
		let obj = {
			id: doc.id,
			...doc.data(),
		};
		pickedItemsData.push(obj);
	});

	pickedItemsData.slice(51).forEach(async (doc) => {
		const id = doc.id;
		let artistId = doc.artist;
		// let pongId = doc.pong;
		// let userId = doc.user;

		await addPickedItemsById(id, artistId, 'Artist');
		//await addPickedItems(id, pongId, 'Pong');
		//await addPickedItems(id, userId, 'User');
	});
};

module.exports = {
	createPickedItems,
	deletePickedItems,
	updatePickedItems,
	addPickedItems,
};
