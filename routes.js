'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();
const { User } = require('./models');

// Async Handler function to wrap each route with try/catch block.
function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			// Forward error to the global error handler
			next(error);
		}
	};
}

// Route that returns a list of users.
router.get(
	'/users',
	asyncHandler(async (req, res) => {
		let users = await User.findAll();
		console.log('!!------ Users ------!!', await User.findAll());
		res.json(users);
	})
);

// Route to create a User
router.post(
	'/users',
	asyncHandler(async (req, res) => {
		// Get the user from the request body.
		const user = req.body;
		console.log('email-------->', user.firstName, user.lastName);

		// Store errors
		const errors = [];

		// Validate that we have a `firstName` value.
		if (!user.firstName) {
			errors.push('Please provide a first name');
		}

		// Validate that we have a `lastName` value.
		if (!user.lastName) {
			errors.push('Please provide a last name');
		}

		// Validate that we have an `email` value.
		if (!user.email) {
			errors.push('Please provide a value for "email"');
		}

		// Validate that we have a `password` value.
		let password = user.password;
		if (!password) {
			errors.push('Please provide a value for "password"');
		} else if (password.length < 8 || password.length > 20) {
			errors.push('Your password should be between 8 and 20 characters');
		}

		// If there are any errors...
		if (errors.length > 0) {
			// Return the validation errors to the client.
			res.status(400).json({ errors });
		} else {
			// Add the user to the database.
			await User.create(req.body);

			// Set the status to 201 Created and end the response.
			res.status(201).end();
		}
	})
);

module.exports = router;
