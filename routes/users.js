const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const message = require('../config/message');
const emailVerify = require('../config/email/email-verify');

//Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		user_name: req.body.user_name,
		full_name: req.body.full_name,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
		verified: true
	});
	User.getUserByEmail(req.body.email, (err, user) => {
		if (err) {
			throw err;
			console.log("ERRR");
		}
		if (!user) {
			User.addUser(newUser, (err, user) => {
				if (err) {
					res.json({
						success: false,
						msg: message.USER_FAILED_REGISTRATION
					});
				} else {
					
					res.json({
						success: true,
						msg: message.USER_SUCCESS_REGISTRATION,
						user: {
							id: user._id,
							user_name: user.user_name,
							full_name: user.full_name,
							email: user.email,
							phone: user.phone,
						}
					});
				}
			});
		} else {
			console.log(message.USER_EXIST);
			return res.json({
				success: false,
				msg: message.USER_EXIST
			});
		}
	});
});

//Authenticate
router.post('/login', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	console.log(req.body);

	User.getUserByEmail(email, (err, user) => {

		if (err) {
			throw err;
			console.log("ERRR");
		}

		if (!user) {
			return res.json({ success: false, msg: message.USER_NOT_FOUND });
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign({ user }, 'secret', {
					expiresIn: 604800 // 1 week
				});

				res.json({
					success: true,
					token,
					user: {
						id: user._id,
						user_name: user.user_name,
						full_name: user.full_name,
						email: user.email,
						phone: user.phone,
					}
				});
			} else {
				return res.json({ success: false, msg: message.USER_WRONG_PASSWORD });
			}
		});
	});
});

//Validate
router.get('/validate', (req, res, next) => {
	emailVerify.sendVerificationEmail("hayashisabrowork@gmail.com");
	res.send('VALIDATE');
});

module.exports = router;