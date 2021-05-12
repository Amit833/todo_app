const customError = require('../helpers/customError');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  try {
    // Grab the cookie/token from the request
    const token = req.cookies.token;
    // Validate the cookie and look for the user with that _id
    const user = await User.findByToken(token);

    // if the token is corrupted, then throw an error
    if (!user) next(customError('User was not found'));

    // if the token is valid
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
