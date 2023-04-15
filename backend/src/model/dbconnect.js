//Import the mongoose module
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
//Set up default mongoose connection
var mongoDB = 'mongodb://db:27017/demo';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
autoIncrement.initialize(db);

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;