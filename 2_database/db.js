const mongoose = require('mongoose');

let connection;

// creates a async connection to our db
const getConnection = async () => {
    if (!connection) {
        connection = await mongoose.connect('mongodb://localhost:27017/Bankingapplication', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
    }
    return connection;
}

module.exports = {
    getConnection: getConnection
}