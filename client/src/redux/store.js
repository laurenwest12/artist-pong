import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//reducers
import { artists } from './artists';
import { artistNames } from './artistNames';
import { pickedItems } from './pickedItems';
import { pongs } from './pongs';
import { users } from './users';

const reducer = combineReducers({
	artists,
	artistNames,
	pickedItems,
	pongs,
	users,
});

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
