const firebase = require('firebase');
const { firebaseConfig } = require('../config');
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = {
	db,
};
