const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
require('dotenv').config();

/*** connect db ***/
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString);
const database = mongoose.connection
database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})
/*****/

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at host 3000`)
})

app.use('/api', routes)