var request = require('request');
var IncomingWebhook = require('@slack/client').IncomingWebhook;

var url = process.env.SLACK_WEBHOOK_URL || '';
var wh = new IncomingWebhook(url);
var whWithDefaults = new IncomingWebhook(url, {
  username: 'enkida',
  iconEmoji: ':slack:',
  channel: 'general'
});


function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function send(payload, callback) {
  var path = process.env.INCOMING_WEBHOOK_PATH;
  //var uri = 'https://hooks.slack.com/services' + path;

  request({
    uri: path,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    callback(null, response.statusCode, body);
  });
}

module.exports = function (req, res, next) {
  // default roll is 2d6
  var matches;
  var times = 2;
  var die = 6;
  var rolls = [];
  var total = 0;
  var botPayload = {};

  if (req.body.text) {
    // parse roll type if specified
    matches = req.body.text.match(/^(\d{1,2})d(\d{1,2})$/);

    if (matches && matches[1] && matches[2]) {
      times = matches[1];
      die = matches[2];
    } else {
      // send error message back to user if input is bad
      return res.status(200).send('<number>d<sides>');
    }
  }

  // roll dice and sum
  for (var i = 0; i < times; i++) {
    var currentRoll = roll(1, die);
    rolls.push(currentRoll);
    total += currentRoll;
  }

  // write response message and add to payload
  botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + _
							die + ':\n' + rolls.join(' + ') + ' = *' + total + '*';
  botPayload.username = 'dicebot';
  botPayload.channel = req.body.channel_id;
  botPayload.icon_emoji = ':game_die:';


  send(botPayload, function (error, status, body) {
    if (error) {
      return next(error);
    } else if (status !== 200) {
      // inform user that our Incoming WebHook failed
      return next(new Error('Incoming WebHook: ' + status + ' ' + body));
    } // else {
    return res.status(200).end();
    // }
  });
};
