import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//reducers
import { artists } from './artists';
import { artistNames } from './artistNames';
import { pickedItems } from './pickedItems';
import { pongs } from './pongs';

const reducer = combineReducers({
	artists,
	artistNames,
	pickedItems,
	pongs,
});

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
