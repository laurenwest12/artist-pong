import queryString from 'query-string';

export const getFilterUrl = (obj) => {
	if (obj) {
		const arr = [...obj.artistFilter, ...obj.userFilter];
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
	// }
	// if (obj) {
	// 	if (obj.length) {
	// 		const filterObj = obj.reduce((acc, filter) => {
	// 			if (!acc[filter.type]) {
	// 				acc[filter.type] = [filter.value];
	// 			} else {
	// 				acc[filter.type] = [...acc[filter.type], filter.value];
	// 			}
	// 			return acc;
	// 		}, {});
	// 		const url = queryString.stringify(filterObj);
	// 		return `/api/artists/filtered/?${url}`;
	// 	} else {
	// 		return `/api/artists`;
	// 	}
	// } else {
	// 	return `/api/artists`;
	// }
};
