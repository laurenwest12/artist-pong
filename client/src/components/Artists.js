import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArtistsThunk, sortArtistsThunk } from '../redux/artists';

// const sortArtists = (arr, type) => {
// 	return arr.sort
// }

class Artists extends Component {
	constructor() {
		super();
		this.state = {
			popSort: 'desc',
			nameSort: 'asc',
		};
	}

	async componentDidMount() {
		const { getArtists } = this.props;
		await getArtists();
	}

	render() {
		const { artists, sortArtists } = this.props;
		console.log(this.state);

		return (
			<div className="artists">
				<button
					type="button"
					className="sort"
					onClick={() => {
						sortArtists('popularity', this.state.popSort);
						this.setState({
							popSort:
								this.state.popSort === 'asc' ? 'desc' : 'asc',
						});
					}}
				>
					SORT BY POPULARITY
				</button>
				<button
					type="button"
					className="sort"
					onClick={() => {
						sortArtists('name', this.state.nameSort);
						this.setState({
							nameSort:
								this.state.nameSort === 'asc' ? 'desc' : 'asc',
						});
					}}
				>
					SORT BY NAME
				</button>
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
		sortArtists: (type, order) => dispatch(sortArtistsThunk(type, order)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Artists);
