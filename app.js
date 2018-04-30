// Get Requirements
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
// Connect to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:8080/shortUrls');

app.use(bodyParser.json());
app.use(cors());
// allows node to find static content
app.use(express.static(__dirname + '/public'));

// Creates a database entry
app.get("/new/:urlToShorten(*)", (req, res, next) => {
  // var urlToShorten = req.params.urlToShorten; // ES5 version
  var {
    urlToShorten
  } = req.params;
  // Regex for URL
  var expression = /[-a-zA-Z0-9@:%+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%+.~#?&//=]*)?/gi;
  var regex = expression;
  if (regex.test(urlToShorten)) {
    var short = Math.floor(Math.random() * 100000).toString();
    var data = new shortUrl({
      originalUrl: urlToShorten,
      shorterUrl: short
    });
    data.save((err) => {
      if (err) {
        return res.send('Error saving to database');
      };
      return res.json(data);
    })
  }
  else {
    var data = new shortUrl({
      originalUrl: "urlToShorten doesn't match standard format",
      shorterUrl: 'Invalid URL'
    });
    return res.json(data);
  }
});

// Query database and forward to originalUrl
app.get("/:shorterUrl",(req,res,next)=>{

// Stores the value of param
  var {shorterUrl} = req.params;

  shortUrl.findOne({'shorterUrl':shorterUrl},(err,data)=>{

    if(err){
      return res.send('Error occurred while reading database...');
    }
    var re = new RegExp("^(http|https)://","i");
    var strToCheck = data.originalUrl;
    if(re.test(strToCheck)){
      res.redirect(301,data.originalUrl);
    }
    else {
      res.redirect(301,"http://"+data.originalUrl)
    }
  });
});


// Listen to port
//Works both locally and on heroku
app.listen(process.env.PORT || 3000, () => {
  console.log('Everything is working...');
});
