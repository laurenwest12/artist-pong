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
		axios.get('/api/artists/pickedItems').then(({ data }) => {
			let artists = data.sort(sortArtists(type, order));
			return dispatch(getArtists(artists));
		});
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
