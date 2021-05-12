const customError = require('../helpers/customError');
const User = require('../models/User');

const verif = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findByVerifToken(token);
    // if the token is corrupted, then throw an error
    if (!user) next(customError('Looks like your verification token is corrupted...'));

    // if the token is valid
    req.user = user;
    next();
  } catch (error) {}
};

module.exports = verif;
