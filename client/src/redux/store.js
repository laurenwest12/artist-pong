import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//reducers
import { artists } from './artists';

const reducer = combineReducers({
	artists,
});

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
