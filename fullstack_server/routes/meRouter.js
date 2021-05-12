const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authentication');
const { getUserTodos } = require('../controllers/todosControllers');
const { authUser } = require('../controllers/usersControllers');

// route base path: /me

router.route('/todos').get(auth, getUserTodos); // full route path: /me/todos
router.route('/auth').post(auth, authUser); // full route path: /me/auth
module.exports = router;
