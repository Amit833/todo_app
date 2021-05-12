require("dotenv").config() // loads .env file contents into process.env object

const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
const faker = require('faker');

// ENVIRONMENT - CHECK MINIMUM REQUIRED CONFIGURATION FOR STARTUP...
require("../helpers/env-check") // this will cancel the startup if necessary env variables are missing...

 // connect to MongoDB
 require("../helpers/db-connect")

console.log(`We are about to execute a seed script`);

// (async function () { })();

(async function () {


  // We need to drop users
  try {
    await User.deleteMany({});
    console.log(`Old users moved to a better place, Spandau`);
  } catch (error) {
    console.log(error);
  }

  // We need to drop todos
  try {
    await Todo.deleteMany({});
    console.log(`Old todos moved to a better place, the woods`);
  } catch (error) {
    console.log(error);
  }

  // Construct 5 fake users and 20 fake todos
  const userPromises = Array(5)
    .fill(null)
    .map(() => {
      //create a fake user
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '0123456789', // we NEED to hash this
        username: faker.internet.userName(),
        avatar: faker.internet.avatar(),
        birthday: faker.date.past(),
      };

      console.log(`User ${userData.email} has been created`);

      const user = new User(userData);
      return user.save(); // => call pre save hook!
    });

  let usersSeeded;

  try {
    usersSeeded = await Promise.all(userPromises);
    console.log(`We stored 5 users in the DB`);
  } catch (error) {
    console.log(error);
  }

  // [{ _id: "12345", username: "losrobbos" }, { _id: "12346", username: "Wasabis" } ]
  const userIds = usersSeeded.map((user) => user._id);

  console.log('User IDs', userIds);

  const todoPromises = Array(20)
    .fill(null)
    .map(() => {
      //create a fake user
      const todoData = {
        text: faker.lorem.sentence(),
        userId: faker.random.arrayElement(userIds), // grab me some random user ID
      };

      console.log(`Todo "${todoData.text}" has been created`);

      const todo = new Todo(todoData);
      return todo.save();
    });

  try {
    await Promise.all(todoPromises);
    console.log(`We stored 20 todos in the DB`);
  } catch (error) {
    console.log(error);
  }

  mongoose.connection.close();
})();
