import queryString from 'query-string';

export const getFilterUrl = (arr) => {
	if (arr) {
		if (arr.length) {
			const filterObj = arr.reduce((acc, filter) => {
				if (!acc[filter.type]) {
					acc[filter.type] = [filter.value];
				} else {
					acc[filter.type] = [...acc[filter.type], filter.value];
				}
				return acc;
			}, {});
			const url = queryString.stringify(filterObj);
			return `/api/artists/filtered/?${url}`;
		} else {
			return `/api/artists`;
		}
	} else {
		return `/api/artists`;
	}
};
