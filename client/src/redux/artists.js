import axios from 'axios';

import { sortArtists } from '../helperFunctions/sort';
import { getFilterUrl } from '../helperFunctions/filterUrl';

//constants
const GET_ARTISTS = 'GET_ARTISTS';

//action creators
const getArtists = (artists) => ({
	type: GET_ARTISTS,
	artists,
});

//thunks
export const getArtistsThunk = () => {
	return (dispatch) => {
		axios
			.get('/api/artists')
			.then(({ data }) => dispatch(getArtists(data)));
	};
};

export const sortArtistsThunk = (type, order, filter) => {
	return (dispatch) => {
		const url = getFilterUrl(filter);
		console.log(filter);
		if (type === 'pickedItems' || type === 'lastCall') {
			axios.get(url).then(({ data }) => {
				let artists;
				if (type === 'lastCall') {
					const lastCallData = data.reduce((acc, artist) => {
						const {
							name,
							genres,
							followers,
							spotifyId,
							images,
							popularity,
							pickedItems,
							avgSongs,
							avgPick,
							shared,
						} = artist;
						const lastCall = pickedItems.filter(
							(item) => item.lastCall
						).length;
						acc.push({
							name,
							genres,
							followers,
							spotifyId,
							images,
							popularity,
							pickedItems,
							lastCall,
							avgSongs,
							avgPick,
							shared,
						});
						return acc;
					}, []);
					artists = lastCallData.sort(sortArtists(type, order));
				} else {
					artists = data.sort(sortArtists(type, order));
				}
				return dispatch(getArtists(artists));
			});
		} else {
			axios.get(url).then(({ data }) => {
				let artists = data.sort(sortArtists(type, order));
				return dispatch(getArtists(artists));
			});
		}
	};
};

export const filterArtistsThunk = (obj) => {
	return (dispatch) => {
		const url = getFilterUrl(obj);
		axios.get(url).then(({ data }) => {
			return dispatch(getArtists(data));
		});
	};
};

//reducer
export const artists = (state = [], action) => {
	switch (action.type) {
		case GET_ARTISTS:
			return action.artists;
		default:
			return state;
	}
};
