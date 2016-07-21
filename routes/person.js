var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'patronus_assigner',
  port: 5432
};

router.post('/', function(request, response){
  var client = new pg.Client(config);


  console.log(request.body);
  var personFirstName = request.body.first_name;
  var personLastName = request.body.last_name;
  client.connect(function(err){
    if(err){
      console.log('Connection error, go fix your wand.', err);
    }
    client.query('INSERT INTO people (first_name, last_name) VALUES ($1, $2)',
      [personFirstName, personLastName], function(err){
      if(err){
        console.log('Query error, go back to beginner charms class Harry!!', err);
        response.sendStatus(500);
      } else {
        console.log('Y\'r a wizard Harry!!!');
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

router.get('/', function(request, response){
  var client = new pg.Client(config);
  var peopleList = {};

  client.connect(function(err){
    if(err){
      console.log('Connection error, please fix your wand.', err);
    }
    client.query('SELECT pp.id, pp.first_name, pp.last_name, pp.patronus_id, pt.patronus_name FROM people AS pp LEFT OUTER JOIN patronus AS pt ON pt.id = pp.patronus_id',
    function(err, result){
      if(err){
        console.log('Query error, go back to beginner charms class Harry!!', err);
        response.sendStatus(500);
      } else {
        peopleList = result.rows;
        console.log('Y\'r a wizard Harry!!!', peopleList);
        response.send(peopleList);
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
