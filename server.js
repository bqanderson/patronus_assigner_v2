var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var index = require('./routes/index');
var person = require('./routes/person');
var patronus = require('./routes/patronus');

var config = {
  database: 'patronus_assigner',
  port: 5432
};

var app = express();

// Static files
app.use(express.static('public'));

app.use(bodyParser.json());

// Routers
app.use('/', index);
app.use('/person', person);
app.use('/patronus', patronus);

// test for join query
app.get('/join', join);
app.post('/assign', assign);

function join(request, response){
   var client = new pg.Client(config);

   client.connect(function(err){
     if(err){
       console.log('Connection error', err);
     }
     client.query('SELECT * FROM people RIGHT OUTER JOIN patronus ON patronus.id = people.patronus_id ORDER BY patronus.id',
     function(err, result){
       if(err){
         console.log("Query Error");
         response.sendStatus(500);
       }else{
       console.log(result.rows);
       response.send(result.rows);
      }
     })

   })
}

function assign(request, response){
  var client = new pg.Client(config);

  var personId = request.body.personId;
  var patronusId = request.body.patronusId;
  client.connect(function(err){
    if(err){
      console.log('Connection Error: ', err);
    }
    client.query('UPDATE people SET patronus_id = $1 WHERE people.id = $2',
    [patronusId, personId], function(err){
      if(err){
        console.log('Query Error: ', err);
        response.sendStatus(500);
      }else{
        response.sendStatus(200);
      }
      client.end(function(err){
        if(err){
          console.log('Disconnect error: ', err);
        }
      })
    })


  })
}

var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
});
