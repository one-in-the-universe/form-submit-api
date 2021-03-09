const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    oid: String,
    cid: String,
    pid: Number,
    name: String,
    phone: String,
    mail: String,
    product: String,
    size: String,
    quantity: Number,
    for: String,
    occasion: String,
    date: String,
    picture: String,
    address: String,
});

const order = mongoose.model('Orders', orderSchema);

module.exports = order;