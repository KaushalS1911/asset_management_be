require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require("mongoose");
const port = process.env.PORT || 8000

const app = express();

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`)
})

