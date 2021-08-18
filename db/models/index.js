const Artist = require('./Artist');
const PickedItem = require('./PickedItem');
const Pong = require('./Pong');
const User = require('./User');

Artist.hasMany(PickedItem);
PickedItem.belongsTo(Artist);

Pong.hasMany(PickedItem);
PickedItem.belongsTo(Pong);

User.hasMany(PickedItem);
PickedItem.belongsTo(User);

module.exports = {
	Artist,
	PickedItem,
	Pong,
	User,
};
