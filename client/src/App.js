import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Import components
import Home from './components/Home';
import Artists from './components/Artists';

class App extends Component {
	componentDidMount() {}

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/artists" component={Artists} />
				</Switch>
			</Router>
		);
	}
}

export default App;
