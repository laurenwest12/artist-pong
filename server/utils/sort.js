const sortArtists = (key, order) => {
	return function innerSort(a, b) {
		let varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
		let varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

		varA = Array.isArray(a[key]) ? a[key].length : a[key];
		varB = Array.isArray(b[key]) ? b[key].length : b[key];

		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}
		return !order ? comparison * -1 : comparison;
	};
};

const sortNames = (a, b) => {
	const varA = a.toUpperCase();
	const varB = b.toUpperCase();

	let comparison = 0;
	if (varA > varB) {
		comparison = 1;
	} else if (varA < varB) {
		comparison = -1;
	}
	return comparison;
};

module.exports = {
	sortArtists,
	sortNames,
};
