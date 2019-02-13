const express = require('express')
const bodyParser = require('body-parser');//json için. aşağıda use ile ekleniyor
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 5001;
const uristring = 'mongodb://mtekin:Mt777777!.@ds024548.mlab.com:24548/tekin';
var userService = require('./services/userService');
var ladService = require('./services/ladService');


express()
  .use(cors())
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.send('Listening on '+PORT))
  .use('/user',userService.router)
  .use('/lad',ladService.router)
  .get('/mt', (req, res) => res.send('MT TEST'))
  .get('/test', (req, res) => res.send(showTimes()))
  .listen(PORT, () => console.log('Listening on %s', PORT))


  mongoose.connect(uristring, function (err, res) {
    if (err) {
      console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log('Succeeded connected to: ' + uristring);
    }
  });
  

showTimes = () => {
  let result = 'First Test'
  return result;
}


