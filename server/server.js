const path = require('path');
const dotenv = require('dotenv').config();
const express = require('express');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const app = express();
const bodyParser = require('body-parser');
const AppService = require('./AppService.js')
const ShortlistResults = require('./db/ShortlistResults.js');
const Categories = require('./db/Categories.js');
const Google = require('@google/maps').createClient({key: process.env.GOOGLE_MAPS});

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/public'));

app.post('/shortlist', function(req, res) {
    ShortlistResults.insertShortlist(req.body);
    res.send();
});

app.post('/query', function(req, res) {
	let queryWithFilters = req.body;
  AppService.find(queryWithFilters)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.send(error);
    })
});

app.get('/categories', function(req, res) {
  let categories = Categories.find().exec();
  categories.then(results => {
    res.json(results);
  })
    .catch(error => {
      res.send(error);
    })
});

app.get('/google', function(req, res) {

  return new Promise (function(resolve, reject) {
    Google.places({query: 'golden gate bridge in san francisco, ca'}, (
    function(error, result) {
      if (error) {
        console.log('error', error);
      } else {
        // console.log(result.json.results.photos.getUrl({'maxWidth': 35, 'maxHeight': 35}));
        // res.send(JSON.stringify(result.json.results));
        resolve(result.json.results[0].place_id);
      }
    }))
    
  }).then(function(query) {
    // console.log(query);
    return new Promise (function(resolve, reject) {
    Google.place({placeid: query}, (
    function(error, result) {
      if (error) {
        console.log('error', error);
      } else {
        // console.log(result.json.result.photos);
        // console.log(result.json.results.photos.getUrl({'maxWidth': 35, 'maxHeight': 35}));
        // res.send(JSON.stringify(result));
        resolve(result.json.result.photos[3].photo_reference);
      }
    }))
    });
  }).then(function(query) {
    console.log(query);
    return new Promise (function(resolve, reject) {
    Google.placesPhoto({
      photoreference: query,
      maxwidth: 500,
      maxheight: 500
    }, (
    function(error, result) {
      if (error) {
        console.log('error', error);
      } else {
        console.log('resultsss--------', result);
        //result.socket.TLSSocket
        // console.log(result.json.results.photos.getUrl({'maxWidth': 35, 'maxHeight': 35}));
        res.send(result.body);
        resolve(result);
      }
    }))
    });
  })
  // res.setHeader('Access-Control-Allow-Origin','*');
  // res.setHeader('Access-Control-Allow-Headers','content-type');
  // return new Promise (function(resolve, reject) {
  //       let requestString = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBYHC_gun-viMBtOEoZvlB_OBGrqynxBMU&libraries=places';
  //       request(requestString, function(error, response) {
  //         if (error) {
  //           console.error(error);
  //           reject(error);
  //         } else {
  // console.log("-.-.-.-", res.header()._headers);
  //           res.send(response.body);
  //           resolve(response.body);
          
  //         }
  //       });
  //     });

});

// ««««««««« start app  »»»»»»»»»
app.listen(port, function() {
  console.log('Listening on port ', port);
});
