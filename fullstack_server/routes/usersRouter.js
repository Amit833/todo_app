const express = require('express');
const router = express.Router();
const {
  userValidationRules,
  userValidationErrorHandling,
} = require('../middleware/validation');
const { auth } = require('../middleware/authentication');
const verif = require('../middleware/emailVerification');

const {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  verifyUserAccount,
  loginUserGoogle,
} = require('../controllers/usersControllers');

// ROUTER = SUB API => /users

// ROUTE MATCHING
// route => /login
// method => POST

// Route: /users
router
  .route('/')
  .get(auth, getUsers)
  .post(userValidationRules(), userValidationErrorHandling, addUser);

// Route: /users/login
router.route('/login').post(loginUser);

// Taking care of the Google login
router.route('/googleLogin').post(loginUserGoogle);

// Route for verifying the user account
router.route('/verify').post(verif, verifyUserAccount);

router.route('/logout').get(logoutUser); // clears the login cookie...

// Route: /users/:id
// would match all these below:
// /users/12345
// /users/login
// /users/whatever
router.route('/:id').get(auth, getUser).put(auth, updateUser).delete(auth, deleteUser);

module.exports = router;
