const mongoose = require('mongoose');
const env = require('../config/config');

/**MONGODB CONNECTION */
// const strConnLocal = "mongodb://localhost/todos_db"
console.log('Mongo Connection URL: ', env.db);

mongoose
  .connect(env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('Connection to cloud database established!'))
  .catch((err) => console.log('[ERROR] DB Connection failed', err));

// alternative: handle errors with events
// mongoose.connection.on('error', () => console.log('Can not connect to the DB'));
// mongoose.connection.on('open', () => console.log('Connected to the database....'));

module.exports = mongoose.connection;
