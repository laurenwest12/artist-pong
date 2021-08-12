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

module.exports = {
	getReferenceObj,
};
