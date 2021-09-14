const router = require('express').Router();
const { Op } = require('sequelize');
const { sortArtists, sortNames } = require('../utils/sort');
const { Artist, PickedItem, User } = require('../db/models/index');
const e = require('express');

const addAdditionalAttributes = (sortedArtists) => {
	let artists = [];
	for (let i = 0; i < sortedArtists.length; ++i) {
		const artist = sortedArtists[i].dataValues;
		const pickedItems = artist.pickedItems.map((item) => item.dataValues);
		const avgSongs =
			Math.round(
				(100 *
					pickedItems.reduce((acc, item) => {
						acc += item.numSongs;
						return acc;
					}, 0)) /
					pickedItems.length
			) / 100;
		const avgPick =
			Math.round(
				(100 *
					pickedItems.reduce((acc, item) => {
						acc += item.pickNumber;
						return acc;
					}, 0)) /
					pickedItems.length
			) / 100;
		const shared = pickedItems.filter((item) => item.userId === 5).length;
		artist.pickedItems = pickedItems;

		artists.push({
			...artist,
			avgSongs,
			avgPick,
			shared,
		});
	}
	return artists;
};

const addUserFilter = (artists, users) => {
	let filteredArtists = [];
	for (let i = 0; i < artists.length; ++i) {
		let artist = artists[i];
		const {
			name,
			genres,
			followers,
			spotifyId,
			images,
			popularity,
			createdAt,
			updatedAt,
			pickedItems,
			shared,
		} = artist;

		const userPickedItems = pickedItems.filter((item) =>
			users.includes(item.userId)
		);

		const avgSongs =
			Math.round(
				(100 *
					userPickedItems.reduce((acc, item) => {
						acc += item.numSongs;
						return acc;
					}, 0)) /
					userPickedItems.length
			) / 100;
		const avgPick =
			Math.round(
				(100 *
					userPickedItems.reduce((acc, item) => {
						acc += item.pickNumber;
						return acc;
					}, 0)) /
					userPickedItems.length
			) / 100;

		if (userPickedItems.length) {
			filteredArtists.push({
				name,
				genres,
				followers,
				spotifyId,
				images,
				popularity,
				createdAt,
				updatedAt,
				pickedItems: userPickedItems,
				avgSongs,
				avgPick,
				shared,
			});
		}
	}
	return filteredArtists;
};

const removeUserFilter = (artists, users, allArtists) => {
	const notUsedArtists = [];

	for (let i = 0; i < allArtists.length; ++i) {
		const artist = allArtists[i];
		const pickedItems = artist.pickedItems.filter((item) =>
			users.includes(item.userId)
		);

		if (pickedItems.length === 0) {
			notUsedArtists.push(artist.name);
		}
	}

	const filteredArtists = artists.filter((artist) =>
		notUsedArtists.includes(artist.name)
	);

	return filteredArtists;
};

router.get('/', async (req, res) => {
	const artistsRes = await Artist.findAll({
		include: PickedItem,
	});
	const sortedArtists = artistsRes.sort(sortArtists('name', true));
	const artists = addAdditionalAttributes(sortedArtists);

	res.send(artists);
});

router.get('/names', async (req, res) => {
	const artists = await Artist.findAll();
	const artistNames = artists.map((artist) => artist.name);
	const sortedNames = artistNames.sort(sortNames);
	res.send(sortedNames);
});

router.get('/filtered?', async (req, res) => {
	const artistsRes = await Artist.findAll({
		include: PickedItem,
	});
	const sortedArtists = artistsRes.sort(sortArtists('name', true));
	const allArtists = addAdditionalAttributes(sortedArtists);

	const query = req.query;
	let artists;
	let artistsParams = [];

	if (query.name) {
		if (Array.isArray(query.name)) {
			query.name.map((artist) => {
				artistsParams.push({
					name: artist,
				});
			});
		} else {
			artistsParams.push({
				name: query.name,
			});
		}
		const artistsRes = await Artist.findAll({
			where: {
				[Op.or]: artistsParams,
			},
			include: PickedItem,
		});
		const sortedArtists = artistsRes.sort(sortArtists('name', true));
		artists = addAdditionalAttributes(sortedArtists);
	} else {
		const artistsRes = await Artist.findAll({
			include: PickedItem,
		});
		const sortedArtists = artistsRes.sort(sortArtists('name', true));
		artists = addAdditionalAttributes(sortedArtists);
	}

	if (query.user) {
		const users = [];
		if (!Array.isArray(query.user)) {
			users.push(parseInt(query.user));
		} else {
			query.user.map((user) => users.push(parseInt(user)));
		}
		artists = addUserFilter(artists, users);
	}

	if (query.notUser) {
		const notUsers = [];
		if (!Array.isArray(query.notUser)) {
			notUsers.push(parseInt(query.notUser));
		} else {
			query.notUser.map((user) => notUsers.push(parseInt(user)));
		}

		artists = removeUserFilter(artists, notUsers, allArtists);
	}

	res.send(artists);
});

router.get('/:id', async (req, res) => {
	const artist = await Artist.findByPk(req.params.id);
	res.send(artist);
});

module.exports = router;
