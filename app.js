
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// crud
app.post('/worker/crud', routes.crud);

// wines 
app.get('/', routes.index);

// todos
app.get('/another', routes.another);

// upload
app.post('/upload', routes.upload);

// api/wines
app.get('/api/wines', routes.all);            //get All
app.get('/api/wines/:id', routes.get);        //get One
app.post('/api/wines', routes.post);          //create One
app.put('/api/wines/:id', routes.put);        //update One
app.delete('/api/wines/:id', routes.delete);  //delete One

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
