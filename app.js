'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const routes = require('./routes');
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging =
	process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup CORS support
app.use(
	cors()
	// {
	// origin: 'https://remote-learners.vercel.app',
	// methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	// }
);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the remote learners rest api',
	});
});

// Add routes
app.use('/api', routes);

// setup a global error handler
app.use((err, req, res, next) => {
	if (enableGlobalErrorLogging) {
		console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
	}

	res.status(err.status || 500).json({
		message: err.message,
		error: {},
	});
});

// send 404 if no other route matched
app.use((req, res) => {
	res.status(404).json({
		message: 'Route Not Found',
	});
});

// Test connection to database
(async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({ force: false });
		console.log('Connection to database successful!');
	} catch (err) {
		console.log('ERROR! Connection to database unsuccessful!', err);
	}
})();

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
	console.log(`Express server is listening on port ${server.address().port}`);
});
