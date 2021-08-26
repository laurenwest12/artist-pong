import axios from 'axios';

//constants
const GET_ARTIST_NAMES = 'GET_ARTIST_NAMES';

//action creators
const getArtistNames = (artistNames) => ({
	type: GET_ARTIST_NAMES,
	artistNames,
});

//thunks
export const getArtistNamesThunk = () => {
	return (dispatch) => {
		axios
			.get('/api/artists/names')
			.then(({ data }) => dispatch(getArtistNames(data)));
	};
};

//reducer
export const artistNames = (state = [], action) => {
	switch (action.type) {
		case GET_ARTIST_NAMES:
			return action.artistNames;
		default:
			return state;
	}
};
