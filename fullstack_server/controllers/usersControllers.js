const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const customError = require('../helpers/customError');
const { sendVerificationEmail } = require('../mailer/setup');

exports.getUsers = async (req, res, next) => {
  let users = await User.find().sort('firstName');
  res.send(users);
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    // => will not trigger the pre save hook
    // let userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });

    // find the user first
    let user = await User.findById(id);
    // update the user fields
    Object.assign(user, req.body);
    const userUpdated = await user.save(); // => this will trigger the pre save hook
    res.json(userUpdated);
  } catch (err) {
    next(err);
  }
};

// SIGNING UP USER
exports.addUser = async (req, res, next) => {
  //youfrontend.com/user/verify/SDGaSDGASGASDGDAHdxgAsdgerHrJFgj
  const userData = req.body;
  try {
    // Create the user and grab the user IDs
    const user = new User(userData);

    // Generate a token
    const token = user.generateAuthToken();

    // Generate an email verification token
    const verifToken = user.generateEmailVerifToken();
    user.emailVerificationToken = verifToken;
    await user.save();

    // Send an email verification email
    sendVerificationEmail(user);

    // put the token in the response
    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 604800000),
        sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'lax',
        secure: process.env.NODE_ENV == 'production' ? true : false, //http on localhost, https on production
        httpOnly: true,
      })
      .json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    let userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) throw new Error();
    res.json(userDeleted);
  } catch (err) {
    next(customError(`Todo with ID ${id} does not exist`));
  }
};

exports.logoutUser = async (req, res, next) => {
  res.clearCookie('token', {
    sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'lax',
    secure: process.env.NODE_ENV == 'production' ? true : false, //http on localhost, https on production
    httpOnly: true,
  }); // clear the cookie in the browser
  res.json({ message: 'Logged you out successfully' });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // grab me a user from DB by email & password
    const userFound = await User.findOne({ email });

    // handle user not found by given credentials
    if (!userFound) {
      return next(
        customError(
          `Not found this user with email ${email}, my friend. Try again...`,
          401
        )
      );
    }

    // compare the password given in plain text from frontend
    // with the hashed password stored in database
    const pwCompareResult = bcryptjs.compareSync(password, userFound.password);

    if (!pwCompareResult) {
      return next(customError('Wrong password', 401));
    }

    // Generate a token
    const token = userFound.generateAuthToken();

    // put the token in the response
    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 604800000),
        sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'lax',
        secure: process.env.NODE_ENV == 'production' ? true : false, //http on localhost, https on production
        httpOnly: true,
      })
      .json(userFound);
  } catch (err) {
    next(error);
  }
};

exports.loginUserGoogle = async (req, res, next) => {
  const { email, googleId, firstName, lastName } = req.body; //email, googleId, firstName, lastName
  try {
    let user = await User.findOne({
      email,
    });

    console.log('USER FOUND', user);

    if (!user) {
      // Why findOneAndUpdate i hear you ask
      // Stackoverflow says:
      // What's going on is that none of Mongoose's validation, middleware,
      // or default values are used when calling any of the "update" family of
      // methods, like findByIdAndUpdate. They're only invoked by calls to save or create.
      // Sooooooo that means even though we create a user with no password using findOneAndUpdate,
      //  nobody cares cause we bypass the schema rules.

      user = await User.findOneAndUpdate(
        { email },
        { googleId, email, firstName, lastName },
        { new: true, upsert: true }
      );

      console.log('USER CREATED', user);

      if (!user)
        return next(
          customError(
            `Not found this user with email ${email}, my friend. Try again...`,
            401
          )
        );
    }

    // After user creation we follow the normal path
    // Generate a token
    const token = user.generateAuthToken();
    console.log('TOKEN', token);

    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 604800000),
        sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'lax',
        secure: process.env.NODE_ENV == 'production' ? true : false, //http on localhost, https on production
        httpOnly: true,
      })
      .json(user);
  } catch (error) {
    next(error);
  }
};

exports.authUser = (req, res) => {
  //req.user
  res.json(req.user);
};

exports.verifyUserAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { emailIsVerified: true }, { new: true });
    res.json({ message: `Your user (${req.user.email}) has been validated.` });
  } catch (error) {
    next(error);
  }
};
