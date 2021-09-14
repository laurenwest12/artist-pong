import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import {
	getArtistsThunk,
	sortArtistsThunk,
	filterArtistsThunk,
} from '../redux/artists';
import { getArtistNamesThunk } from '../redux/artistNames';
import { getPickedItemsThunk } from '../redux/pickedItems';
import { getPongsThunk } from '../redux/pongs';
import { getUsersThunk } from '../redux/users';

class Artists extends Component {
	constructor() {
		super();
		this.state = {
			// true = asc, false = desc
			popularity: true,
			name: false,
			pickedItems: true,
			lastCall: true,
			avgSongs: true,
			avgPick: false,
			shared: true,
			artistFilter: [],
			userFilter: [],
			notUserFilter: [],
		};
	}

	async componentDidMount() {
		const {
			getPickedItems,
			getPongs,
			sortArtists,
			getArtistNames,
			getUsers,
		} = this.props;
		await getPickedItems();
		await getPongs();
		await sortArtists('pickedItems', false);
		await getArtistNames();
		await getUsers();
	}

	render() {
		const {
			artists,
			artistNames,
			pickedItems,
			pongs,
			sortArtists,
			filterArtists,
			users,
		} = this.props;

		const artistsFilter =
			artistNames &&
			artistNames.map((artist) => ({
				type: 'name',
				label: artist,
				value: artist,
			}));

		const usersFilter =
			users &&
			users.map((user) => ({
				type: 'user',
				label: user.username,
				value: user.id,
			}));

		const notUsersFilter =
			users &&
			users.map((user) => ({
				type: 'notUser',
				label: user.username,
				value: user.id,
			}));

		const handleSort = (type, order) => {
			sortArtists(type, order, [
				...this.state.artistFilter,
				...this.state.userFilter,
				...this.state.notUserFilter,
			]);

			let defaultState = {
				popularity: true,
				name: false,
				pickedItems: true,
				lastCall: true,
				avgSongs: true,
				avgPick: false,
				shared: true,
			};

			defaultState[type] = order;
			this.setState(defaultState);
		};

		const handleFilter = (type) => (event) => {
			if (type === 'artist') {
				this.setState(
					{
						artistFilter: event,
					},
					() => {
						filterArtists(this.state);
					}
				);
			} else if (type === 'user') {
				this.setState(
					{
						userFilter: event,
					},
					() => {
						filterArtists(this.state);
					}
				);
			} else if (type === 'notUser') {
				this.setState(
					{
						notUserFilter: event,
					},
					() => {
						filterArtists(this.state);
					}
				);
			}
		};
		return (
			artists.length &&
			pongs.length &&
			pickedItems.length && (
				<div className="container">
					<div className="sort">
						{' '}
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort(
									'pickedItems',
									!this.state.pickedItems
								);
							}}
						>
							SORT BY TIMES USED
						</button>
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort('lastCall', !this.state.lastCall);
							}}
						>
							SORT BY LAST CALL
						</button>
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort('avgSongs', !this.state.avgSongs);
							}}
						>
							SORT BY AVERAGE # SONGS
						</button>
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort('avgPick', !this.state.avgPick);
							}}
						>
							SORT BY AVERAGE PICK
						</button>
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort('shared', !this.state.shared);
							}}
						>
							SORT BY TIMES SHARED
						</button>
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort(
									'popularity',
									!this.state.popularity
								);
							}}
						>
							SORT BY POPULARITY
						</button>
						<button
							type="button"
							className="sort"
							onClick={() => {
								handleSort('name', !this.state.name);
							}}
						>
							SORT BY NAME
						</button>{' '}
					</div>
					<div className="artists__filter">
						<Select
							isMulti
							options={artistsFilter}
							onChange={handleFilter('artist')}
						/>

						<Select
							isMulti
							options={usersFilter}
							onChange={handleFilter('user')}
						/>

						<Select
							isMulti
							options={notUsersFilter}
							onChange={handleFilter('notUser')}
						/>
					</div>
					<div className="artists">
						{artists.length &&
							artists.map((artist) => (
								<div
									className="artists__artist"
									key={artist.name}
								>
									<div>
										{artist.images.length ? (
											<img
												className="artists__artist__img"
												src={artist.images[1].url}
												alt={artist.name}
											/>
										) : (
											<img
												className="artists__artist__img"
												src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
												alt={artist.name}
											/>
										)}
									</div>

									<div className="artists__artist__name">
										{artist.name}
									</div>
									<div className="artists__artist__info">
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
										Average Number of Songs:{' '}
										{artist.avgSongs}
										<br />
										Times Shared: {artist.shared}
										<br />
										Average Pick Number: {artist.avgPick}
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
		artistNames: state.artistNames,
		pickedItems: state.pickedItems,
		pongs: state.pongs,
		users: state.users,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArtists: () => dispatch(getArtistsThunk()),
		getArtistNames: () => dispatch(getArtistNamesThunk()),
		sortArtists: (type, order, filter) =>
			dispatch(sortArtistsThunk(type, order, filter)),
		filterArtists: (obj) => dispatch(filterArtistsThunk(obj)),
		getPickedItems: () => dispatch(getPickedItemsThunk()),
		getPongs: () => dispatch(getPongsThunk()),
		getUsers: () => dispatch(getUsersThunk()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Artists);
