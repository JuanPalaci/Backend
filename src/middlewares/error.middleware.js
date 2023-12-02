const debug = require('debug')('MyMeal-api:error');

const errorHandler = (err, req, res, next) => {
	// Error handling goes here
    debug(err);
    return res.status(err.status || 500).json({ message: err.message });
}
module.exports = { errorHandler };