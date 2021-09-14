import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './components/Nav';

//Import components
import Home from './components/Home';
import Artists from './components/Artists';

class App extends Component {
	componentDidMount() {}

	render() {
		return (
			<Router>
				<Route component={Nav} />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/artists" component={Artists} />
				</Switch>
			</Router>
		);
	}
}

export default App;
