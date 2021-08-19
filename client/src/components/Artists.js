import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArtistsThunk, sortArtistsThunk } from '../redux/artists';
import { getPickedItemsThunk } from '../redux/pickedItems';
import { getPongsThunk } from '../redux/pongs';

class Artists extends Component {
	constructor() {
		super();
		this.state = {
			popSort: 'desc',
			nameSort: 'asc',
		};
	}

	async componentDidMount() {
		const { getArtists, getPickedItems, getPongs } = this.props;
		await getArtists();
		await getPickedItems();
		await getPongs();
	}

	render() {
		const { artists, pickedItems, pongs, sortArtists } = this.props;

		const getPongName = (id) => {
			return pongs.find((pong) => pong.id === id).name;
		};

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
					artists.map((artist) => (
						<div key={artist.name}>
							{artist.name}
							<div>
								{pickedItems
									.filter(
										(item) =>
											item.artistName === artist.name
									)
									.map((item) => (
										<div>{getPongName(item.pongId)}</div>
									))}
							</div>
						</div>
					))}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		artists: state.artists,
		pickedItems: state.pickedItems,
		pongs: state.pongs,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArtists: () => dispatch(getArtistsThunk()),
		sortArtists: (type, order) => dispatch(sortArtistsThunk(type, order)),
		getPickedItems: () => dispatch(getPickedItemsThunk()),
		getPongs: () => dispatch(getPongsThunk()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Artists);
