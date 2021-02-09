const mongoose = require('mongoose');

//the account schema
const AccountSchema = new mongoose.Schema({


    _id: {
        type: Number,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: false
    },
    balance: {
        type: Number,
        required: false
    }
}, {collection: "Accounts"});

const model = mongoose.model('Account', AccountSchema);

module.exports = model;