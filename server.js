var express = require('express');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var request = require("request");
var routes = require('./server/routes.js'); //requesting  my module routes

var app = express();
app.use(bodyParser());
app.use(express.static(__dirname + '/'));
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/');

app.get('/', function(req, res) {
    res.render("index");
});

app.get('/pages', function(req, res) {
    request(req.query.url, function(error, response, body) {
        res.send(body);
    });

});

routes.routes(app);

app.listen(3000, function(req, res) {
    console.log("Server is running on port 3000");
});