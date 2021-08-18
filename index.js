const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT || 8888;
const dotenv = require('dotenv').config();

//Db syncing functions
const { syncAndSeed, dbSync } = require('./db/seed');

//Helper functions
const isLoggedIn = require('./utils/isLoggedIn');

//Routes
const auth = require('./routes/auth');
const artists = require('./routes/artists');
const pickedItems = require('./routes/pickedItems');
const pongs = require('./routes/pongs');
const users = require('./routes/users');

app.use(
	session({
		secret: 'this will be better later',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', auth);
//app.use('/', isLoggedIn);
app.use('/api/artists', artists);
app.use('/api/pickedItems', pickedItems);
app.use('/api/pongs', pongs);
app.use('/api/users', users);

app.get('/', async (req, res) => {
	if (!req.session.access_token) {
		res.redirect('/login');
	} else {
		//Add authorization token to axios calls
		let token = req.session.access_token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		res.send('Hello world');
	}
});

dbSync().then(() =>
	app.listen(PORT, async () => {
		console.log('App is listening...');
	})
);
