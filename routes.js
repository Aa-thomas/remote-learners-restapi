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
			if (
				error.name === 'SequelizeValidationError' ||
				error.name === 'SequelizeUniqueConstraintError'
			) {
				const errors = error.errors.map((err) => err.message);
				res.status(400).json({ 'Sequelize validation error': errors });
			}
			// Forward error to the global error handler
			else next(error);
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
		if (!user.firstName)
			errors.push('Please provide a value for "firstName"');
		if (!user.lastName) errors.push('Please provide a value for "lastName"');
		if (!user.email) errors.push('Please provide a value for "email"');

		// Validate Password. Checks if: exists, length, contains at least one letter, number and special character
		if (!user.password) errors.push('Please provide a value for "password"');
		if (user.password.length < 8 || user.password.length > 20)
			errors.push('Your password must be between 8 and 20 characters');
		if (user.password.search(/[a-z]/i) < 0)
			errors.push('Your password must contain at least one letter');
		if (user.password.search(/[0-9]/) < 0)
			errors.push('Your password must contain at least one digit');
		// your passwoord should contain 1 special character
		if (user.password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) < 0)
			errors.push(
				'Your password must contain at least one special character'
			);
		// If not validating through SQL, hash the password here before storing password
		// user.password = bcrypt.hashSync(password, 10);a

		// If there are any errors...
		if (errors.length > 0) {
			// Return the validation errors to the client.
			res.status(400).json({ 'Server validation error': errors });
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
		if (!course.title) errors.push('Please provide a title');
		if (!course.description) errors.push('Please provide a description');

		// If there are any errors...
		if (errors.length > 0) {
			// Return the validation errors to the client.
			res.status(400).json({ 'Server validation error': errors });
		} else {
			// Add the course to the database.
			await Course.create(req.body);

			// Set the location header
			res.location('/courses/:id');
			// Set the status to 201 Created and end the response.
			res.status(201).end();
		}
	})
);

// PUT // Updates a course
router.put(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		// Get the course using the params from the request body
		const course = await Course.findByPk(req.params.id);
		console.log(course);
		if (!course)
			res.status(400).json({ message: 'This course does not exist' });

		// Store errors
		const errors = [];

		// Validate the values in the request.
		if (!course.title) errors.push('Please provide a title');
		if (!course.description) errors.push('Please provide a description');

		// If there are any errors...
		if (errors.length > 0) {
			// Return the validation errors to the client.
			res.status(400).json({ 'Server validation error': errors });
		} else {
			// Update the course in the database.
			await course.update(req.body);
			// Set the status to 204 No Content and end the response.
			res.status(204).end();
		}
	})
);

// DELETE // Deletes a course
router.delete(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		// Get the course using the params from the request body
		const course = await Course.findByPk(req.params.id);
		console.log(course);

		// Check if course exists
		if (course) {
			// Delete the course in the database.
			await course.destroy();
			// Set the status to 204 No Content and end the response.
			res.status(204).end();
		} else {
			// If course does not exist, return 404
			res.status(404).json({ message: 'This course does not exist' });
		}
	})
);

module.exports = router;
