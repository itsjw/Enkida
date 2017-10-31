var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var dicebot = require('./dicebot');

var events = require('./lib/clients/events');
var retryPolicies = require('./lib/clients/retry-policies');

var app = express();
// var port = process.env.PORT || 3000;

module.exports = {
  WebClient: require('./lib/clients/web/client'),
  RtmClient: require('./lib/clients/rtm/client'),
  IncomingWebhook: require('./lib/clients/incoming-webhook/client'),
  LegacyRtmClient: require('./lib/clients/default/legacy-rtm'),
  MemoryDataStore: require('./lib/data-store/memory-data-store'),
  CLIENT_EVENTS: {
    WEB: events.CLIENT_EVENTS.WEB,
    RTM: events.CLIENT_EVENTS.RTM
  },
  RTM_EVENTS: events.RTM_EVENTS,
  RTM_MESSAGE_SUBTYPES: events.RTM_MESSAGE_SUBTYPES,
  RETRY_POLICIES: retryPolicies
};


// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));


// test route
app.get('/', function (req, res) { 
	res.status(200).send('Hello world!');
});

// hellobot
app.post('/hello', hellobot);

// dicebot
app.post('/roll', dicebot);


// basic error handler
app.use(function (err, req, res) {
  // console.error(err.stack);
  res.status(400).send(err.message);
});
