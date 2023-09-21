
'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { TrxManager } = require('./transaction-manager');

const app = express()

const trxManager = new TrxManager();

const jsonParser = bodyParser.json()
const textParser = bodyParser.text({ type: '*/*' });


app.post('/trx-notify', jsonParser, (req, res, next) => {
  const trxNotification = req.body;
  console.log("trxNotify: %j", trxNotification);
  try {
    trxManager.addTransaction(trxNotification);

    res.status(200).json({ process: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * POST csv report to reconcile
 *
 * 
 */
app.post('/reconcile', textParser, (req, res, next) => {
  try {
    trxManager.reconcile(req.body);
    res.status(200).json({ process: true });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});


//Basic error handler
app.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  next(err);
});

if (module === require.main) {
  // Start the server
  const server = app.listen(8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}


module.exports = app;
