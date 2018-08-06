var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");

var PORT = process.env.PORT || 8000;

var app = express();

var db = require("./models");

//mongoose db configuration
var mongoose = require("mongoose");
var request = require("request");
var cherrio = require("cheerio");
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));
var databaseUri = "mongodb://localhost/scraper";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
//end of mongoose configuration

// //mongoose error
// var db = mongoose.connection;

// db.on('error', function (err) {
//   console.log('mongoose error: ', err);
// });
// //end of mongoose error

// //mongoose success message
// db.once('open', function () {
//   console.log('mongoose connection successful: ', err);
// });
// //mongoose success end

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes/routes.js')(app);

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});