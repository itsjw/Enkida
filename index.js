var hellobot = require('./hellobot');
var express = require('express');
var app = express();

fruitbotwin = 0
fruitbotloss = 0
fruitbottie = 0

app.post('/hello', hellobot);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/fruitbotwin', function(request, response) {
  fruitbotwin++
  response.json(fruitbotwin);
});
app.get('/fruitbotloss', function(request, response) {
  fruitbotloss++
  response.json(fruitbotloss);
});
app.get('/fruitbottie', function(request, response) {
  fruitbottie++
  response.json(fruitbottie);
});
app.get('/fruitbottotals', function(request, response) {
  response.json([fruitbotwin,fruitbotloss,fruitbottie]);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

