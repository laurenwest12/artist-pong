const { db } = require('../db');

const getReferenceObj = async (initColl, initId, destVar, destColl) => {
	const initRef = db.collection(initColl).doc(initId);
	const initSnap = await initRef.get();
	const initData = initSnap.data();

	const destData = initData[destVar];
	const destRef = db.collection(destColl).doc(destData.id);
	const destSnap = await destRef.get();
	const objData = destSnap.data();
	return {
		collectionId: destData.id,
		...objData,
	};
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
		const destRef = db.collection(destColl).doc(dest.collectionId);
		await destRef.update({
			pickedItems: destPickedItems,
		});
	}
};

module.exports = {
	getReferenceObj,
	addPickedItemsReferences,
};
