const mongoose = require('mongoose');

// the Client schema
const ClientSchema = new mongoose.Schema({

    _id: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
}, {collection: "Clients"});

const model = mongoose.model('Client', ClientSchema);

module.exports = model;