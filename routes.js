'use strict';

const express = require('express');

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
		await User.create(req.body);
		res.redirect('/users');
	})
);

module.exports = router;
