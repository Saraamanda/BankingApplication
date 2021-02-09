const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const seaport = require('seaport')
const ports = seaport.connect('localhost', 9090)
const fs = require('fs')
const https = require('https')

const options = {
    key: fs.readFileSync('key/key.pem', 'utf8'),
    cert: fs.readFileSync('key/cert.pem', 'utf8')
};

//Added Json Body-parser
app.use(bodyParser.json());

//Import Routes
const accountRoute = require('./routes/accounts');
app.use('/accounts', accountRoute)

//Import Client Routes
const clientRoute = require('./routes/clients');
app.use('/clients', clientRoute)


//Initial route / root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the banking app');
});

////Start listening
//app.listen(ports.register('server'), () => {
//    console.log('Server listening on 8080');
//});

const server = https.createServer(options, app)
server.listen(ports.register('server'), function () {
    console.log('server2 listening on %d', this.address().port);
});

