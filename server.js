var express = require ('express');
var session = require('express-session');
var bodyParser = require ('body-parser');
var ejs = require ('ejs')
var request = require ('request');
var app = express();
var bcrypt = require('bcrypt');


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("database.db");


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static('public'));

app.use(session({
  secret: "penguin",
  resave: false,
  saveUninitialized: true
}));


// homepage
app.get('/', function(req, res) {
  	res.render('index.ejs'); //add any items to send over via ejs
});

app.get('/login', function(req, res){
    res.render('login.ejs');
});


//new user
app.post('/user', function(req, res){
  var first_name = req.body.first_name;
  console.log(first_name);
  var last_name = req.body.last_name;
  console.log(last_name)
  var email = req.body.email;
  console.log(email)
  var avatar_url = req.body.avatar_url;
  console.log(avatar_url)
  var username = req.body.username;
  var password = req.body.password;
  var confirm_password = req.body.confirm_password;

  if(password === confirm_password){
    var hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    db.run('INSERT INTO users(username, password, first_name, last_name, email, avatar_url) VALUES(?, ?, ?, ?, ?, ?)',
             username, hash, first_name, last_name, email, avatar_url, function(err){
      if(err){ throw err;}
      else{
      req.session.valid_user = true;
      res.redirect('/menu');
      }
    });
  }
  else{
    res.redirect('/login');
  }
})



//login
app.post('/session', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  db.get('SELECT * FROM users WHERE username = ?', username, function(err, row){
    if(err){ throw err }
    if(row){ 
      var passwordMatches = bcrypt.compareSync(password, row.password);
      if(passwordMatches){
      req.session.valid_user = true;
      res.redirect('/menu') 
    }
    else{ res.redirect('/') }
  }
  })

})





app.get('/menu', function(req, res){
  if(req.session.valid_user === true){
  res.render('menu.ejs')
  }
  else{
    res.redirect('/')
  }
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