import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const navTabs = [
	{ name: 'Home', path: '/' },
	{ name: 'Artists', path: '/artists' },
	{ name: 'Pongs', path: '/pongs' },
	{ name: 'Users', path: '/users' },
	{ name: 'Log In', path: '/login' },
];

const Nav = () => {
	return (
		<div className="nav">
			<div class="nav__tabs">
				{navTabs.map((tab) => {
					return (
						<Link
							key={tab.name}
							to={tab.path}
							className="nav__link"
						>
							{tab.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default connect()(Nav);
