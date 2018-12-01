const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

//Register
router.post('/register', (req, res, next) => {
	let newUser = new Admin({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	Admin.addUser(newUser, (err, user) => {
		if (err) {
			res.json({ success: false, msg: 'Failed to register user' });
		} else {
			res.json({ success: true, msg: 'User registered' });
		}
	});
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log(req.body);
	Admin.getUserByUsername(username, (err, user) => {
		if (err) {
			throw err;
			console.log("ERRR");
		}
		if (!user) {
			console.log("User not found");
			return res.json({ success: false, msg: 'User not found' });
		}
		console.log(user);
		Admin.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign({ user }, 'secret', {
					expiresIn: 604800 // 1 week
				});
				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			}
			else {
				return res.json({ success: false, msg: 'Wrong Password' });
			}
		});
	});
});

//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	res.json({ user: req.user });
});

//Validate
router.get('/validate', (req, res, next) => {
	res.send('VALIDATE');
});

module.exports = router;