
const express =       require("express");
const bodyParser =    require("body-parser");
const logger =        require("morgan");
const mongoose =      require("mongoose");
const setup =         require('./config').init();

var app = express();
//////////////////////////////////////////////////////////////////////////
////////////////// db config to capture messages   //////////////////////
////////////////////////////////////////////////////////////////////////

mongoose.Promise = Promise;
mongoose.connect(setup.db.uri);

const db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

var Example = require("./exampleModel.js");

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

////////////////////////////////////////////////////////////
////////////////////  Routes     /////////////////////////
/////////////////////////////////////////////////////////

const machineRoute =     express.Router();
require('./routes/machine/design1')(machineRoute);

////////////////////

app.get("/machine", machineRoute )

app.post("/submit", function(req, res) {

  req.body.array = ["item1", "item2", "item3"];
  req.body.boolean = false;

  var content = new Example(req.body);

  content.save(function(error, doc) {
    if (error) {
      res.send(error);
    }
    else {
      res.send(doc);
    }
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
