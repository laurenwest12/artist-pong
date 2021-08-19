import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArtistsThunk } from '../redux/artists';

class Artists extends Component {
	async componentDidMount() {
		const { getArtists } = this.props;
		await getArtists();
	}

	render() {
		const { artists } = this.props;
		return (
			<div>
				{artists.length &&
					artists.map((artist) => <div>{artist.name}</div>)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		artists: state.artists,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArtists: () => dispatch(getArtistsThunk()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Artists);
