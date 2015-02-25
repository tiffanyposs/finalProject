var express = require ('express');

var bodyParser = require ('body-parser');
var cors = require('cors')
var ejs = require ('ejs')
var request = require ('request');
var app = express();




var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("database.db");


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.static('public'));



// homepage
app.get('/', function(req, res) {
  res.sendFile('index.html'); //add any items to send over via ejs
});

app.get('/api', function(req,res){
  res.send(content)
});



var restaurant = "nobu";
// fedora


var content = ""

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
      "name": restaurant,
      "menus" : { "$present" : true }
    }
  ]
}

// menuData["venue_queries"][0]['name'] = restaurant;
// buttermilk channel
// union square cafe
// fedora
// the dutch
//narcissa
// bistro central parc


var menuRequest = request.post('https://api.locu.com/v2/venue/search', {form: JSON.stringify(menuData)}, function(err, httpResponse, body) {
    content = body
});












app.listen(3000)


