const { db } = require('./db');

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

module.exports = {
	getPongNames,
	createPongs,
	deletePongs,
};
