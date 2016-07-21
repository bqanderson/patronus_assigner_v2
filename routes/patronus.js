var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'patronus_assigner',
  port: 5432
};

router.post('/add', function(request, response){

  var client = new pg.Client(config);

  // console.log(request.body);
  var patronusName = request.body.patronus;
  client.connect(function(err){
    if(err){
      console.log('Connection error, no Quidditch for you!', err);
    }
    client.query('INSERT INTO patronus (patronus_name) VALUES ($1)', [patronusName], function(err){
      if(err){
        console.log('Query error, go back to beginner charms class!', err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }

      client.end(function(err){
        if(err){
          console.log('Disconnect error', err);
        }
      })

    })
  })

})

router.get('/get', function(request, response){
  var client = new pg.Client(config);

  var patronusList = {};

  client.connect(function(err){
    if(err){
      console.log('Connection error, no Quidditch for you!', err);
    }
    client.query('SELECT * FROM patronus;', function(err, result){
      patronusList = result.rows;
      if(err){
        console.log('Query error, go back to beginner charms class!', err);
        response.sendStatus(500);
      } else {
        console.log('Y\'r a wizard Harry!!! ', patronusList);
        response.send(patronusList);
      }

      client.end(function(err){
        if(err){
          console.log('Disconnect error', err);
        }
      })

    })
  })

})

module.exports = router;
