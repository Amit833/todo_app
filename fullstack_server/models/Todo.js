const mongoose = require("mongoose")
const { Schema, model } = mongoose

// TodoSchema - contains rules how every todo should look like
const TodoSchema = new Schema({
  text: { type: String, required: true },
  status: { type: Boolean, default: false },
  userId: {
    type: Schema.Types.ObjectId, // all references have to have ObjectId
    ref: 'User' // tell mongoose in WHICH collection to look up this ID
  }
}, {
  versionKey: false,
  timestamps: true
})

// Todo model => our interface to the database (=todos collection)
const Todo = model("Todo", TodoSchema) // => todos

// we just export the MODEL (not the schema)
module.exports = Todo
