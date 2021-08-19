import axios from 'axios';

const GET_PONGS = 'GET_PONGS';

const getPongs = (pongs) => ({
	type: GET_PONGS,
	pongs,
});

export const getPongsThunk = () => {
	return (dispatch) => {
		axios.get('/api/pongs').then(({ data }) => dispatch(getPongs(data)));
	};
};

export const pongs = (state = [], action) => {
	switch (action.type) {
		case GET_PONGS:
			return action.pongs;
		default:
			return state;
	}
};
