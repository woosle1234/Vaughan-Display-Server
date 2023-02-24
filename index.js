const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const routes = require('./routes')
var path    = require("path");
require('dotenv').config();

let tempraryImageDirectory;
        if (process.env.DEV && process.env.DEV === 'Yes') {
            tempraryImageDirectory = path.join(__dirname, `../../tmp/`);
        } else {
            tempraryImageDirectory = '/tmp/';
        }

 //import mongoose
 const mongoose = require('mongoose');

 //establish connection to database
 mongoose.connect(
    process.env.MONGODB_URI,
     { useUnifiedTopology: true, useNewUrlParser: true},
     (err) => {
         if (err) return console.log("Error: ", err);
         console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
     }
 );
 

const PORT = process.env.PORT || 3000;

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use('/tmp',express.static(tempraryImageDirectory));
app.use('/uploads', express.static('./uploads'));
app.use(express.static(path.join(__dirname, 'html'))); 


app.use("/",routes);

app.listen(PORT, function() {
    console.log('listening on '+PORT)
  })