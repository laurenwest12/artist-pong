const { db } = require('./db');

const getUsers = (arr) => {
	const uniqueNames = arr.reduce((acc, obj) => {
		let user = obj['D'];
		!acc.includes(user) && acc.push(user);
		return acc;
	}, []);
	return uniqueNames;
};

const createUsers = (arr) => {
	arr.forEach((user) => {
		if (user !== 'Picked By') {
			db.collection('User').doc(user).set({
				uername: user,
				password: 'Brooklyn1',
				pickedItems: [],
			});
		}
	});
	console.log('Users created');
};

module.exports = {
	getUsers,
	createUsers,
};
