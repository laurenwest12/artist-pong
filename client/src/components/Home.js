import React, { Component } from 'react';

class Home extends Component {
	render() {
		return (
			<div className="home">
				<div className="home__section">
					<img
						src="./pong.png"
						alt="pong"
						className="home__section__image"
					/>
					<div className="home__section__info">
						<h1>What is Artist Pong?</h1>
						<p>
							Artist pong is a fun way to listen to your favorite
							artists and also get drunk. It combines a playlist
							that you control with common elements of beer pong.
							The difference here is that you're all on the same
							team.
						</p>
					</div>
				</div>
				<div className="home__section">How To</div>
				<div className="home__section">Examples</div>
			</div>
		);
	}
}

export default Home;
