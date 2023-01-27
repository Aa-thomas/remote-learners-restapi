'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();
const { User, Course } = require('./models');

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

// GET // Returns a list of users.
router.get(
	'/users',
	asyncHandler(async (req, res) => {
		let users = await User.findAll();
		console.log('!!------ Users ------!!', await User.findAll());
		res.json(users);
	})
);

// POST // Create a User
router.post(
	'/users',
	asyncHandler(async (req, res) => {
		// Get the user from the request body.
		const user = req.body;

		// Store errors
		const errors = [];

		// Validate the values in the request.
		if (!user.firstName) {
			errors.push('Please provide a first name');
		}

		if (!user.lastName) {
			errors.push('Please provide a last name');
		}

		if (!user.email) {
			errors.push('Please provide a value for "email"');
		}

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

			// Set the location header
			res.location('/');

			// Set the status to 201 Created and end the response.
			res.status(201).end();
		}
	})
);

// GET // Returns a list of courses
router.get(
	'/	courses',
	asyncHandler(async (req, res) => {
		const courses = await Course.findAll();
		res.json(courses);
	})
);

// GET // Returns a course (including the user associated with the course)
router.get(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		const course = await Course.findByPk(req.params.id);
		res.json(course);
	})
);

// POST // Creates a course
router.post(
	'/courses',
	asyncHandler(async (req, res) => {
		// Get the course from the request body.
		const course = req.body;

		// Store errors
		const errors = [];

		// Validate the values in the request.
		if (!course.title) {
			errors.push('Please provide a title');
		}

		if (!course.description) {
			errors.push('Please provide a description');
		}

		// If there are any errors...
		if (errors.length > 0) {
			// Return the validation errors to the client.
			res.status(400).json({ errors });
		} else {
			// Add the course to the database.
			await Course.create(req.body);

			// Set the location header
			res.location('/');
			// Set the status to 201 Created and end the response.
			res.status(201).end();
		}
	})
);

// PUT // Updates a course

module.exports = router;
