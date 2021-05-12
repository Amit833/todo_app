const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authentication');

const {
  getTodo,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  deleteMultipleTodos,
  updateMultipleTodos,
} = require('../controllers/todosControllers');
const { validateTodo } = require('../middleware/validation');

// /todos == base route
router.route('/').get(auth, getTodos).post(auth, validateTodo, addTodo);
router
  .route('/multiple')
  .delete(auth, deleteMultipleTodos)
  .post(auth, updateMultipleTodos);

// /todos/:id
router.route('/:id').get(auth, getTodo).put(auth, updateTodo).delete(auth, deleteTodo);

module.exports = router;
