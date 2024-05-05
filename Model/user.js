// Importing the mongoose library, which allows interaction with MongoDB
const mongoose = require('mongoose');

// Connecting to a MongoDB database running locally on port 27017 with the database name "Auth"
mongoose.connect('mongodb://127.0.0.1:27017/Auth');

// Defining a schema for the 'user' collection in the MongoDB database
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number
});

// Exporting the userSchema as a model named "user". This allows us to interact with the 'user' collection in the database.
module.exports = mongoose.model("user", userSchema);