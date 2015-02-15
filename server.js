var express = require ('express');
var session = require('express-session');
var bodyParser = require ('body-parser');
var ejs = require ('ejs')
var request = require ('request');
var app = express();
var bcrypt = require('bcrypt');


var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database("database.db");


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));



// homepage
app.get('/', function(req, res) {
  	res.render('index.ejs'); //add any items to send over via ejs
})

app.get('/menu', function(req, res){
  res.render('menu.ejs')
})

// sends menu items from the below api request
app.get('/api_info', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.send(content);
})



//begin
var menuData = {
  "api_key" : "fcec945baccf86e8829f5a34b95f0aeeaecdd3d3",
  "fields" : [
    "locu_id",
    "name",
    "description",
    "website_url",
    "menus",
    "open_hours",
    "extended",
    "description"
  ],
  "venue_queries" : [
    {
      "name": "bistro central parc",
      "menus" : { "$present" : true }
    }
  ]
}

var content = ""

var menuRequest = request.post('https://api.locu.com/v2/venue/search', {form: JSON.stringify(menuData)}, function(err, httpResponse, body) {
    content = body;
});

console.log(content)







app.listen(3000)