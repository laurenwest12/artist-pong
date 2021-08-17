const excelToJson = require('convert-excel-to-json');
const db = require('./db');
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

const syncAndSeed = () => {
	const artists = getUniqueValues('B');
	const pongs = getUniqueValues('A');
	const users = getUniqueValues('D');
	console.log(users);
	//return artists;
	// return db
	// 	.authenticate()
	// 	.then(() => db.sync({ force: true }))
	// 	.then(() => {
	// 		console.log('authenticated');
	// 	});
};

module.exports = syncAndSeed;
