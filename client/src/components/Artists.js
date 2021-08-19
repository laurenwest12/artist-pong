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
			usedSort: 'desc',
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

		return (
			artists.length &&
			pongs.length &&
			pickedItems.length && (
				<div className="container">
					<button
						type="button"
						className="sort"
						onClick={() => {
							sortArtists('pickedItems', this.state.usedSort);
							this.setState({
								usedSort:
									this.state.usedSort === 'asc'
										? 'desc'
										: 'asc',
								popSort: 'desc',
								nameSort: 'asc',
							});
						}}
					>
						SORT BY TIMES USED
					</button>
					<button
						type="button"
						className="sort"
						onClick={() => {
							sortArtists('popularity', this.state.popSort);
							this.setState({
								popSort:
									this.state.popSort === 'asc'
										? 'desc'
										: 'asc',
								usedSort: 'desc',
								nameSort: 'asc',
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
									this.state.nameSort === 'asc'
										? 'desc'
										: 'asc',
								popSort: 'desc',
								usedSort: 'desc',
							});
						}}
					>
						SORT BY NAME
					</button>

					<div className="artists">
						{artists.length &&
							artists.map((artist) => (
								<div
									className="artists-artist"
									key={artist.name}
								>
									<div>
										{artist.images.length ? (
											<img
												className="artists-artist-img"
												src={artist.images[1].url}
												alt={artist.name}
											/>
										) : (
											<img
												className="artists-artist-img"
												src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
												alt={artist.name}
											/>
										)}
									</div>

									<div className="artists-artist-name">
										{artist.name}
									</div>
									<div className="artists-artist-info">
										Times Used: {artist.pickedItems.length}
										<br />
										Times Last Call:{' '}
										{
											pickedItems.filter(
												(item) =>
													item.artistName ===
														artist.name &&
													item.lastCall
											).length
										}
										<br />
										Spotify Popularity: {artist.popularity}
									</div>
								</div>
							))}
					</div>
				</div>
			)
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
