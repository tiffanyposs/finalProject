var express = require ('express');
var bodyParser = require ('body-parser');
var ejs = require ('ejs')
var request = require ('request');
var app = express();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static('public'));
// app.use(express.static('files'));



// homepage
app.get('/', function(req, res) {
	// res.header('Access-Control-Allow-Origin', "*");
  	res.render('index.ejs'); //add any items to send over via ejs
})

app.get('/menu', function(req, res){
  res.render('menu.ejs')
})

// sends menu
app.get('/api_info', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.send(content);
})



//begin
var menuData = {
  "api_key" : "[Locu_Api_key]",
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



// var locationData = {
//   "api_key" : "fcec945baccf86e8829f5a34b95f0aeeaecdd3d3",
//   "fields" : [ "name", "location", "contact" ],
//   "venue_queries" : [
//     {
//       "location" : {
//         "geo" : {
//           "$in_lat_lng_radius" : [-37.7750, 122.4183, 5000]
//         }
//       }
//     }
//   ]
// }

// var locationRequest = request.post('https://api.locu.com/v2/venue/search', {form: JSON.stringify(locationRequest)}, function(err, httpResponse, body) {
//  	console.log(body)
    
// });



app.listen(3000)