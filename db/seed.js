const db = require('./db');
const { Artist, PickedItem, Pong, User } = require('./models/index');

const excelToJson = require('convert-excel-to-json');
const result = excelToJson({
	sourceFile: './spreadsheetData.xlsx',
});

const data = result['Sheet1'].slice(1);

const getUniqueValues = (column) => {
	return data.reduce((acc, row) => {
		const artist = row[column];
		if (!acc.includes(artist)) {
			acc.push(artist);
		}
		return acc;
	}, []);
};

const createInstances = (model, data) => {
	return Promise.all(data.map((instance) => model.create(instance)));
};

const syncAndSeed = async () => {
	const artists = getUniqueValues('B');
	const pongs = getUniqueValues('A');
	const users = getUniqueValues('D');

	// const usersData = users.map((user) => {
	// 	return {
	// 		username: user,
	// 		password: 'Brooklyn1',
	// 	};
	// });

	let pongNum = 0;
	const pongsData = data.reduce((acc, row, index) => {
		const pong = row['A'];
		const lastCall = row['H'];

		if (index === 0) {
			pongNum++;
			acc.push({
				name: pong,
				number: pongNum,
				lastCall: lastCall === 'Y',
			});
		}

		if (index > 0 && data[index - 1]['A'] !== pong) {
			pongNum++;
			acc.push({
				name: pong,
				number: pongNum,
				lastCall: lastCall === 'Y',
			});
		}
		return acc;
	}, []);

	return db
		.authenticate()
		.then(() => db.sync({ force: true }))
		.then(async () => {
			console.log('Authenticated');
			const res = await createInstances(Pong, pongsData);
			console.log(res);
		});
};

module.exports = syncAndSeed;
