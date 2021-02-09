const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Added Json Body-parser
app.use(bodyParser.json());

//Import Routes
const accountRoute = require('./routes/accounts');
app.use('/accounts', accountRoute)

//Import Client Routes
const clientRoute = require('./routes/clients');
app.use('/clients', clientRoute)


//Initial route
app.get('/', (req, res) => {
    res.send('Welcome to the banking app');
});

//Start listening
app.listen(8080, () => {
    console.log('Server listening on 8080');
});
