const { db } = require('../db');

const getReferenceObj = async (initColl, initId, destVar, destColl) => {
	const initRef = db.collection(initColl).doc(initId);
	const initSnap = await initRef.get();
	const initData = initSnap.data();

	const destData = initData[destVar];
	const destRef = db.collection(destColl).doc(destData.id);
	const destSnap = await destRef.get();
	const objData = destSnap.data();

	// console.log(destData.id);
	// if (destData.id.indexOf('Pong') === -1) {
	// 	console.log(objData);
	// }

	return {
		collectionId: destData.id,
		...objData,
	};
};

const getReferenceById = async (id, coll) => {
	const ref = db.collection(coll).doc(id);
	const snap = await ref.get();
	const data = snap.data();
	return {
		collectionId: id,
		...data,
	};
};

const addPickedItemsById = async (initId, destId, destColl) => {
	const dest = await getReferenceById(destId, destColl);

	let destPickedItems;

	if (dest.pickedItems.length >= 1) {
		if (!dest.pickedItems.includes(initId)) {
			destPickedItems = [...dest.pickedItems, initId];
		}
	} else {
		destPickedItems = [initId];
	}

	if (destPickedItems) {
		try {
			const ref = db.collection(destColl).doc(destId);
			await ref.update({
				pickedItems: destPickedItems,
			});
		} catch (err) {
			console.log(dest.collectionId, err.message);
		}
	}

	console.log(initId);
};

const addPickedItemsReferences = async (
	initColl,
	initId,
	destVar,
	destColl
) => {
	const dest = await getReferenceObj(initColl, initId, destVar, destColl);

	let destPickedItems;
	if (dest.pickedItems) {
		let ids = dest.pickedItems.map((item) => item.id);
		if (!ids.includes(initId)) {
			destPickedItems = [
				...dest.pickedItems,
				db.doc(`PickedItems/${initId}`),
			];
		}
	} else {
		destPickedItems = [db.doc(`PickedItems/${initId}`)];
	}

	if (destPickedItems) {
		try {
			const destRef = db.collection(destColl).doc(dest.collectionId);
			await destRef.update({
				pickedItems: destPickedItems,
			});
		} catch (err) {
			console.log(dest.collectionId, err.message);
		}
	}
};

module.exports = {
	getReferenceObj,
	addPickedItemsById,
	addPickedItemsReferences,
};
