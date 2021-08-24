import axios from 'axios';

import { sortArtists } from '../helperFunctions/sort';

//constants
const GET_ARTISTS = 'GET_ARTISTS';
const SORT_ARTISTS = 'SORT_ARTISTS';

//action creators
const getArtists = (artists) => ({
	type: GET_ARTISTS,
	artists,
});

//thunks
export const getArtistsThunk = () => {
	return (dispatch) => {
		axios
			.get('/api/artists/pickedItems')
			.then(({ data }) => dispatch(getArtists(data)));
	};
};

export const sortArtistsThunk = (type, order) => {
	return (dispatch) => {
		if (type === 'pickedItems' || type === 'lastCall') {
			axios.get('/api/artists/pickedItems').then(({ data }) => {
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
			axios.get('/api/artists/pickedItems').then(({ data }) => {
				let artists = data.sort(sortArtists(type, order));
				return dispatch(getArtists(artists));
			});
		}
	};
};

//reducer
export const artists = (state = [], action) => {
	switch (action.type) {
		case GET_ARTISTS:
			return action.artists;
		case SORT_ARTISTS:
			return action.artists;
		default:
			return state;
	}
};
