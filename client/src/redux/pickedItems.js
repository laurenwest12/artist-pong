import axios from 'axios';

const GET_PICKEDITEMS = 'GET_PICKEDITEMS';

const getPickedItems = (pickedItems) => ({
	type: GET_PICKEDITEMS,
	pickedItems,
});

export const getPickedItemsThunk = () => {
	return (dispatch) => {
		axios
			.get('/api/pickedItems')
			.then(({ data }) => dispatch(getPickedItems(data)));
	};
};

export const pickedItems = (state = [], action) => {
	switch (action.type) {
		case GET_PICKEDITEMS:
			return action.pickedItems;
		default:
			return state;
	}
};
