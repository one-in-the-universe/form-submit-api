var http = require('http');
var fs = require('fs');
var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

var app = express();

//use cors to allow cross origin resource sharing
/*app.use(
  cors({
    origin: 'https://oiu.netlify.app/',
    credentials: true,
  })
);*/
app.use(cors());

//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import Routes
const routes = require('./routes/index.js');
app.use('/', routes);


//Connect to the database
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => app.listen(PORT, () => console.log('Server running on', PORT)))
  .catch((error) => console.log(error.message));

//app.listen(PORT, () => console.log('Server running on', PORT));
//Import our models
const product = require('./models/product');
const order = require('./models/order');
const customer = require('./models/customer');


mongoose.set('useFindAndModify', false);