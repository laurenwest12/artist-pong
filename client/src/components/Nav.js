import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const navTabs = [
	{ name: 'Home', path: '/' },
	{ name: 'Artists', path: '/artists' },
	{ name: 'Pongs', path: '/pongs' },
	{ name: 'Users', path: '/users' },
];

const Nav = () => {
	return (
		<div className="nav">
			{navTabs.map((tab) => {
				return (
					<div class="nav-tabs">
						<Link
							key={tab.name}
							to={tab.path}
							className="nav__link"
						>
							{tab.name}
						</Link>
					</div>
				);
			})}
			<Link to="/login" className="nav__link">
				Log In
			</Link>
		</div>
	);
};

export default connect()(Nav);
