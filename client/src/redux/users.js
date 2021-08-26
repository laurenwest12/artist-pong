import axios from 'axios';

const GET_USERS = 'GET_USERS';

const getUsers = (users) => ({
	type: GET_USERS,
	users,
});

export const getUsersThunk = () => {
	return (dispatch) => {
		axios.get('/api/users').then(({ data }) => dispatch(getUsers(data)));
	};
};

export const users = (state = [], action) => {
	switch (action.type) {
		case GET_USERS:
			return action.users;
		default:
			return state;
	}
};
