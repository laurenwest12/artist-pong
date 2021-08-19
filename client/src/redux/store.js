import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//reducers
import { artists } from './artists';
import { pickedItems } from './pickedItems';
import { pongs } from './pongs';

const reducer = combineReducers({
	artists,
	pickedItems,
	pongs,
});

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
