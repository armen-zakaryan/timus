var express = require('express');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var request = require("request");


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
        res.send(body)
    });

})


app.listen(3300, function(req, res) {
    console.log("Server is running on port 3300");
});