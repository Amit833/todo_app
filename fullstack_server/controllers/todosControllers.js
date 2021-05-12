const Todo = require('../models/Todo');

exports.getUserTodos = async (req, res, next) => {
  // const { userId } = req.params;
  const userId = req.user._id; // read user ID from authenticated user
  const userTodos = await Todo.find({ userId });
  res.json(userTodos);
};

exports.getTodos = async (req, res, next) => {
  let todosAll = await Todo.find().populate('userId'); // grab user document and replace ID by user data
  res.json(todosAll);
};

exports.getTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    res.json(todo);

    // raise an error manually
    // let err = new Error("My Custom message")
    // err.status = 400
    // next(err)
  } catch (err) {
    next(err); // forward error of not found todo
  }
};

exports.updateTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    let todoUpdated = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    res.json(todoUpdated);
  } catch (err) {
    next(err);
  }
};

exports.addTodo = async (req, res, next) => {
  const { text, userId } = req.body;

  try {
    const todoNew = await Todo.create({
      text,
      userId,
    });
    res.json(todoNew);
  } catch (err) {
    next(err); // forward error to central error handler
  }
};

exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    let todoDeleted = await Todo.findByIdAndDelete(id);
    res.json(todoDeleted);
  } catch (err) {
    let error = new Error(`Todo with ID ${id} does not exist`);
    error.status = 400;
    next(error);
  }
};

exports.deleteMultipleTodos = async (req, res, next) => {
  const ids = req.body.todo;

  try {
    let deletedTodos = await Todo.deleteMany({ _id: { $in: ids } });
    res.json(deletedTodos);
  } catch (err) {
    // let error = new Error(`Todo with ID ${id} does not exist`);
    // error.status = 400;
    next(err);
  }
};

exports.updateMultipleTodos = async (req, res, next) => {
  const ids = req.body.todo;
  try {
    let promises = [];
    // We first find the todos we want to update
    let todos = await Todo.find({ _id: { $in: ids } });
    // If the id is also in the todos that need to be updated we find it and toggle it's status
    todos.forEach(async (todo) => {
      let promise = Todo.findByIdAndUpdate(
        todo._id,
        { status: !todo.status },
        { new: true }
      );
      // We pass all promises here so we can resolve them all together
      promises.push(promise);
    });

    const updatedTodos = await Promise.all(promises);
    res.json(updatedTodos);
  } catch (err) {
    // let error = new Error(`Todo with ID ${id} does not exist`);
    // error.status = 400;
    next(err);
  }
};
