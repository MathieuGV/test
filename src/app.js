require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));

// Please keep this module.exports app, we need it for the tests !
module.exports = app;
