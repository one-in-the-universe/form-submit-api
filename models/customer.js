const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    cid: String,
    name: String,
    mail: String,
    phone: Number,
    address: String
});

const customer = mongoose.model('Customers', customerSchema);

module.exports = customer;