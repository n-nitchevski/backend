
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "andyhoogup@gmail.com",
		pass: "!@#$%QWERT"
	}
});

module.exports = {
	sendVerificationEmail: function (email) {
		const token = jwt.sign({ email: email }, 'secret', {
			expiresIn: 7200 // 1 week
		});

		var mailOptions = {
			from: 'andyhoogup@gmail.com',
			to: email,
			subject: 'Sending Email using Node.js',
			text: 'That was easy!'
		};

		smtpTransport.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});

		console.log(token);
	}
}