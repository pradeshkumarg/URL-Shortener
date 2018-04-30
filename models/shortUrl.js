// Template/Structure/Model of document for shortUrl

// Require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shorterUrl: String
}, {
  timestamp: true
});

const ModelClass = mongoose.model('shortUrl',urlSchema);

module.exports = ModelClass;
