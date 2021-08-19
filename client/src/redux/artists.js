import axios from 'axios';

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

//reducer
export const artists = (state = [], action) => {
	switch (action.type) {
		case GET_ARTISTS:
			return action.artists;
		default:
			return state;
	}
};
