import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

import {
	getArtistsThunk,
	sortArtistsThunk,
	filterArtistsThunk,
} from '../redux/artists';
import { getPickedItemsThunk } from '../redux/pickedItems';
import { getPongsThunk } from '../redux/pongs';

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
			personName: [],
		};
	}

	async componentDidMount() {
		const { getPickedItems, getPongs, sortArtists } = this.props;
		await getPickedItems();
		await getPongs();
		await sortArtists('pickedItems', false);
	}

	render() {
		const { artists, pickedItems, pongs, sortArtists, filterArtists } =
			this.props;

		const names = artists.map((artist) => artist.name);
		const testData = ['Little Mix', 'Kehlani'];

		const handleSort = (type, order) => {
			sortArtists(type, order);
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

		const handleFilter = ({ target }) => {
			this.setState({
				personName: target.value,
			});
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
					<div className="filter">
						{console.log(this.state)}
						<FormControl>
							<InputLabel id="demo-mutiple-chip-label">
								Artists
							</InputLabel>
							<Select
								labelId="demo-mutiple-chip-label"
								id="demo-mutiple-chip"
								multiple
								value={this.state.personName}
								onChange={handleFilter}
								input={<Input id="select-multiple-chip" />}
								renderValue={(selected) => (
									<div>
										{selected.map((value) => (
											<Chip key={value} label={value} />
										))}
									</div>
								)}
								//MenuProps={MenuProps}
							>
								{names.map((name) => (
									<MenuItem key={name} value={name}>
										{name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
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
		pickedItems: state.pickedItems,
		pongs: state.pongs,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArtists: () => dispatch(getArtistsThunk()),
		sortArtists: (type, order) => dispatch(sortArtistsThunk(type, order)),
		filterArtists: (obj) => dispatch(filterArtistsThunk(obj)),
		getPickedItems: () => dispatch(getPickedItemsThunk()),
		getPongs: () => dispatch(getPongsThunk()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Artists);
