'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
	// Store the message to display
	let message;

	// Parse the user's credentials from the Authorization header.
	const credentials = auth(req);

	// If the user's credentials are available...
	if (credentials) {
		const user = await User.findOne({
			where: { email: credentials.name },
		});

		// If a user was successfully retrieved from the data store...
		if (user) {
			const authenticated = bcrypt.compareSync(
				credentials.pass,
				user.confirmedPassword
			);

			// If the passwords match...
			if (authenticated) {
				console.log(`Authentication successful for user: ${user.email}`);
				// Store the user on the Request object.
				req.currentUser = user;
			} else {
				message = `Authentication failure for user: ${user.username}`;
			}
		} else {
			message = `User not found for user: ${credentials.name}`;
		}
	} else {
		message = 'Auth header not found';
	}

	// If user authentication failed...
	if (message) {
		console.warn(message);
		res.status(401).json({ message: 'Access Denied' });
	} else {
		next();
	}
};
