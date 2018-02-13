require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

console.log(PAGE_ACCESS_TOKEN);

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// const apiaiApp = apiai(APIAI_TOKEN);

app.get('/', (req, res) => {
  res.status(200).send('361069427');
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  console.log(req.query);
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === WEBHOOK_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

// This is to test chat bot
app.post('/webhook', (req, res) => {
  // console.log(req.body);
  // const myID = '1575752172537936';
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        console.log(event);
        const sender = event.sender.id;
        if (event.message && event.message.text) { // && sender !== myID) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}