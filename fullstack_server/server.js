require('dotenv').config(); // loads .env file contents into process.env object

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const todosRouter = require('./routes/todosRouter');
const usersRouter = require('./routes/usersRouter');
const meRouter = require('./routes/meRouter');
const cookieParser = require('cookie-parser');
const env = require('./config/config');

// ENVIRONMENT - CHECK MINIMUM REQUIRED CONFIGURATION FOR STARTUP...
require('./helpers/env-check'); // this will cancel the startup if necessary env variables are missing...

// connect to MongoDB
require('./helpers/db-connect');

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

/**EXPRESS MIDDLEWARE */
app.use(express.json());
app.use(
  cors({
    origin: env.frontendOrigin || 'http://localhost:3000', // frontend URL should be configurable
    credentials: true, // allow cookies to be sent from frontend to us
  })
);
app.use('/statics', express.static('statics')); // share files in statics folder on route /statics
app.use(cookieParser()); // parse incoming cookies into req.cookies variable

/**AVAILABLE ROUTES */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// IN THIS ROUTE WE CAN FRELY EXPERIMENT TOGETHER WITH JAVASCRIPT :)
app.get('/test', (req, res) => {
  let user = { name: 'Rob' };
  let body = { age: 36, password: 'newPw' };

  Object.assign(user, body); // merge properties into an object

  res.json(user);
});

/**ROUTES */
app.use('/todos', todosRouter);
app.use('/users', usersRouter);
app.use('/me', meRouter); // handles all requests for logged in users

/**ERROR HANDLING - John Errori*/
app.use(function errorHandler(err, req, res, next) {
  res.status(err.status || 500).send({
    error: {
      message: err.message,
    },
  });
});
