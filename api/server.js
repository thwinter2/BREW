require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const stylesRouter = require('./routes/styles');
const categoriesRouter = require('./routes/categories');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

require("./models/User.js");

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["somesecretsauce"]
  })
);

// MongoDB configuration
const db = process.env.MONGO_URI;
// const db = 'mongodb://127.0.0.1:27017/Brews';

// Use mongoose to connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/styles', stylesRouter);
app.use('/categories', categoriesRouter);
  
// Passport config
require("./passport");

require("./routes/auth.js")(app);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App running on port ${port}`));
