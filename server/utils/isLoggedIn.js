const isLoggedIn = (req, res, next) => {
	if (req.session.access_token) {
		next();
	} else {
		res.redirect('/login');
	}
};

module.exports = isLoggedIn;
