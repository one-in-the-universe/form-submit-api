const express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
const product = require('../models/product');
const order = require('../models/order');
const customer = require('../models/customer');
const mongoose = require('mongoose');
var crypto = require('crypto');
var PDFDocument = require('pdfkit');
const fs = require('fs');

const router = express.Router();


router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "/" + '../templates/index.html'));
});

router.get('/sizechart', function (req, res) {
  res.sendFile(path.join(__dirname + "/" + '../templates/sizechart.html'));
})

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + "/" + '../templates/login.html'));
})


router.post('/', async function (req, res) {
  console.log("Tried to post to /");

  const temp_cid = crypto.randomBytes(16).toString("hex");

  const cus = customer.find({ phone: req.body.customer.phone });
  const cus_docs = await cus;

  var customerDetails = "Customer Details: \n";
  customerDetails = customerDetails.concat("\n    Name: ", req.body.customer.name);
  customerDetails = customerDetails.concat("\n    Email: ", req.body.customer.mail);
  customerDetails = customerDetails.concat("\n    Phone: ", req.body.customer.phone);
  customerDetails = customerDetails.concat("\n    Address: ", req.body.customer.address);

  if (cus_docs.length == 0) {

    const cust = new customer({
      cid: temp_cid,
      name: req.body.customer.name,
      mail: req.body.customer.mail,
      phone: req.body.customer.phone,
      address: req.body.customer.address
    }).save();
  } else {
    console.log("Customer already exists");
  }

  var orderDetails = `\n\n\nOrder Details: \n\n`;

  for (var i = 0; i < Object.keys(req.body.order).length; i++) {
    const prod = product.findOne({ vertical: req.body.order[i].variant, type: req.body.order[i].variantType });
    const prod_docs = await prod;

    const lookup_day = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };

    const ord = new order({
      oid: req.body.order[i].id,
      cid: (cus_docs.length > 0) ? cus_docs[0].cid : temp_cid,
      pid: prod_docs.pid,
      name: req.body.customer.name,
      phone: req.body.customer.phone,
      mail: req.body.customer.mail,
      product: prod_docs.vertical,
      size: prod_docs.type,
      quantity: req.body.order[i].quantity,
      for: req.body.order[i].for,
      occasion: req.body.order[i].occasion,
      date: new Date(),
      picture: 'To be added',
      address: req.body.customer.address,
    }).save();

    orderDetails = orderDetails.concat("Product ", i+1);
    orderDetails = orderDetails.concat("\n    Product: ", req.body.order[i].variant);
    orderDetails = orderDetails.concat("\n    Product Size: ", req.body.order[i].variantType);
    orderDetails = orderDetails.concat("\n    Quantity: ", req.body.order[i].quantity);
    orderDetails = orderDetails.concat("\n    For: ", req.body.order[i].for);
    orderDetails = orderDetails.concat("\n    Occasion: ", req.body.order[i].occasion);
  }

  var transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    secureConnection: false,
    tls: {
      ciphers:'SSLv3'
    },
    reuireTLS: true,
    debug: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  })

  var mailText = "Hello, \n\nWe have received your request for our One-In-The-Universe products!\n\nPlease find below a copy of your request form with the details you've filled in.\n\nOur consultant will get in touch with you soon to take this process forward. Thank you for your support. We look forward to serving you. \n\nHave a Great Day! \n\nWarm Regards, \nOIU Team\n\n\n";

  pdfText = customerDetails;
  pdfText = pdfText.concat(orderDetails);

  let pdfDoc = new PDFDocument;
  pdfDoc.pipe(fs.createWriteStream('temp.pdf'));
  pdfDoc.text(pdfText);
  pdfDoc.end();

  var mailOptions1 = {
    from: process.env.OFFICIAL_MAIL,
    to: req.body.customer.mail,
    subject: 'Order confirmation mail',
    text: mailText,
    attachments: [
      {
        filename: req.body.customer.name.concat('.pdf'),
        path: path.join(__dirname, '../temp.pdf'),
        contentType: 'application/pdf'
      }
    ]
  };

  var mailOptions2 = {
    from: process.env.OFFICIAL_MAIL,
    to: process.env.OFFICIAL_MAIL,
    subject: 'Order confirmation mail',
    text: mailText,
    attachments: [
      {
        filename: req.body.customer.name.concat('.pdf'),
        path: path.join(__dirname, '../temp.pdf'),
        contentType: 'application/pdf'
      }
    ]
  };

  transporter.sendMail(mailOptions1, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent to customer: ' + info.response);
    }
  });

  transporter.sendMail(mailOptions2, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent to OIU mail: ' + info.response);
    }
  });

  res.sendFile(path.join(__dirname + "/" + '../templates/greetings.html'));
});

module.exports = router;