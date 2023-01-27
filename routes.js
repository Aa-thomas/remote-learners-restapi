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

/*** USERS ROUTES ***/

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
		if (!user.firstName) errors.push('Please provide a first name');
		if (!user.lastName) errors.push('Please provide a last name');
		if (!user.email) errors.push('Please provide a value for "email"');

		// Check if the email is already in use.
		if (!user.password) {
			errors.push('Please provide a value for "password"');
		} else if (user.password.length < 8 || user.password.length > 20) {
			errors.push('Your password should be between 8 and 20 characters');
		}

		// If there are any errors...
		if (errors.length > 0) {
			// Return the validation errors to the client.
			res.status(400).json({ errors });
		} else {
			// Add the user to the database.
			await User.create(req.body);

			// Set the location header, then status to 201 Created and end the response.
			res.location('/').status(201).end();
		}
	})
);

/*** COURSES ROUTES ***/

// GET // Returns a list of courses (including the User's associated with the course)
router.get(
	'/courses',
	asyncHandler(async (req, res) => {
		const courses = await Course.findAll({
			include: [
				{
					model: User,
					attributes: ['firstName', 'lastName', 'email'],
				},
			],
			attributes: [
				'id',
				'title',
				'description',
				'materialsNeeded',
				'userId',
			],
		});
		res.status(200).json(courses);
		res.json(course);
	})
);

// GET // Returns a single course ( and associated User's )
router.get(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		const courses = await Course.findByPk(req.params.id, {
			include: [
				{
					model: User,
					attributes: ['firstName', 'lastName', 'email'],
				},
			],
		});
		res.json(courses);
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
