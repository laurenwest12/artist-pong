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

	const usersData = users.map((user) => {
		return {
			username: user,
			password: 'Brooklyn1',
		};
	});

	return db
		.authenticate()
		.then(() => db.sync({ force: true }))
		.then(async () => {
			console.log('Authenticated');
		});
};

module.exports = syncAndSeed;
