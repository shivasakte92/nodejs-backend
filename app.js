'use strict';

var express = require('express');
var app = express();

var braintree = require('braintree');

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'cwdpmj2qc4dfnpcg',
    publicKey:    '68xs3kmm7rqf36gv',
    privateKey:   '1c90e5f6ac0e107c45b3b1f5fedadf7e'
});

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {

  gateway.clientToken.generate({}, function (err, res) {
    response.render('index', {
      clientToken: res.clientToken
    });
  });

});

app.post('/process', parseUrlEnconded, function (request, response) {

  var transaction = request.body;

  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {

    if (err) throw err;

    if (result.success) {

      console.log(result);

      response.sendFile('success.html', {
        root: './public'
      });
    } else {
      response.sendFile('error.html', {
        root: './public'
      });
    }
  });

});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

module.exports = app;