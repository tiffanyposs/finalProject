var express = require ('express');
var session = require('express-session');
var bodyParser = require ('body-parser');
var cors = require('cors')
var ejs = require ('ejs')
var request = require ('request');
var app = express();
var bcrypt = require('bcrypt');



var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("database.db");


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.static('public'));

app.use(session({
  secret: "penguin",
  resave: false,
  saveUninitialized: true,
}));

//these are set upon login
var session_info = {
  username : "",
  friends : []
}

// homepage
app.get('/', function(req, res) {
  console.log('/')
  if(req.session.valid_user === true){
    var friends = session_info.friends;
   
  db.get('SELECT username, first_name, last_name, email, avatar_url FROM users WHERE username = ?', session_info.username, function(err, row){  
    var users = row;
    res.render('index.ejs', {friends: friends, users: users}); //add any items to send over via ejs
    })

  }
  else{
    res.redirect('/login')
  }
});



//login page
app.get('/login', function(req, res){
    console.log("/login")
    res.render('login.ejs');
});


//new user
//need to add it so multipe users can't sign up
app.post('/user', function(req, res){
  console.log('/user')
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var avatar_url = req.body.avatar_url;
  var username = req.body.username;
  var password = req.body.password;
  var confirm_password = req.body.confirm_password;

  if(password === confirm_password){
    var hash = bcrypt.hashSync(password, 10);
    // console.log(hash);
    db.run('INSERT INTO users(username, password, first_name, last_name, email, avatar_url) VALUES(?, ?, ?, ?, ?, ?)',
             username, hash, first_name, last_name, email, avatar_url, function(err){
      if(err){ throw err;}
      else{
      req.session.valid_user = true;
      session_info.username = username;
      res.redirect('/loading');
      }
    });
  }
  else{
    res.redirect('/login');
  }
})



//login session
app.post('/session', function(req, res){
  console.log("/session")
  var username = req.body.username;
  var password = req.body.password;
  db.get('SELECT * FROM users WHERE username = ?', username, function(err, row){
    if(err){ throw err }
    if(row){ 
      var passwordMatches = bcrypt.compareSync(password, row.password);
      if(passwordMatches){
      req.session.valid_user = true;
      //captures the username for the current session
      session_info.username = username;
      res.redirect('/loading') 
    }
    else{ res.redirect('/login') }
  }
  })

})

//need to make a sign out


// this makes sure the content loads before it gets to the main login page
app.get('/loading', function(req, res){
    console.log('/loading')
    if(req.session.valid_user === true){
        findFriends(session_info.username, session_info.friends);
        res.redirect('/')
    }
})

//this is the menu page
app.get('/menu', function(req, res){
  console.log('/menu')
  if(req.session.valid_user === true){
    // var friends = session_info.friends;
    // console.log(session_info.friends);
    // console.log(content)
    res.render('menu.ejs')
  }
  else{
    res.redirect('/')
  }
})



app.get('/api_user_info', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  db.get('SELECT username, first_name, last_name, email, avatar_url FROM users WHERE username = ?', session_info.username, function(err, row){
    var user_info = row;
    res.send(user_info)
  })

})


//this sends the friends to the ajax which populates the page
app.get('/api_friends', function(req, res){
  console.log('/api_friends')
  res.header('Access-Control-Allow-Origin', '*');
  var friends = session_info.friends;
  res.send(friends);
})



  //!!!!!!!!!!!!
  //!!!!!!!!!!!!
  //FINDS FRIENDS FROM THE FRIENDS TABLE
  //YOU PASS IT THE USERNAME OF THE USER WHO'S FRIENDS YOU'RE LOOKING FOR
  //CALLED FROM /menu
var findFriends = function(username, friends){
  //finds the id of the passed in user
  db.get('SELECT * FROM users WHERE username = ?', username, function(err, row){
    var id = row.id;
    getFriends(id);
  })
  //function is called that passes in the id of the user
  var getFriends = function(id){
  //two db.all that searches through each column of friends table looking for
  //the users id. If it finds it it passes it's corrisponding friend to the friend_ids array
  db.all('SELECT * FROM friends WHERE friend_one = ?', id, function(err, row_one){
    var friend_ids = [];
        if(row_one.length > 0){
          for(var i = 0; i < row_one.length; i++){          
              friend_ids.push(row_one[i].friend_two);
          }   
        }

    db.all('SELECT * FROM friends WHERE friend_two = ?', id, function(err, row_two){
        if(row_two.length > 0){
          for(var x = 0; x < row_two.length; x++){
          friend_ids.push(row_two[x].friend_one);
            if(row_one.length + row_two.length === friend_ids.length){
              sendFriends(friend_ids)
            }
          }
        }
      else{
        if(row_one.length + row_two.length === friend_ids.length){
          sendFriends(friend_ids)
        }
      }

    })//end second db.all

  })//end first db.all

} //end getFriends
  //this will loop through all of the friend ids, and return their info.
  var sendFriends = function(friend_array){

    var friend_info = [];
    for(var x = 0; x < friend_array.length; x++){
    db.all('SELECT username, first_name, last_name, email, avatar_url FROM users WHERE id = ?', friend_array[x], function(err, row){

        friend_info.push(row)
      if(friend_info.length === friend_array.length){
        // console.log("enter if statement")
        // console.log(friend_info);
        // console.log(friend_info)
        friend_info.forEach(function(each){
          // console.log(each + "each")
          session_info.friends.push(each);
          // console.log(each)
        })
        // return friend_info
      }
    })//end db.all

    } 

  }//end sendFriends

}// end findFriends Function
//!!!!!!!!!!!
//!!!!!!!!!!!




//!!!!!!!!!!
//!!!!!!!!!!
// gets the restaurant info can call with ajax
app.get('/api_info', function(req, res){
  console.log('/api_info')
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
      "name": "buvette",
      "menus" : { "$present" : true }
    }
  ]
}
// buttermilk channel
// union square cafe
// fedora
// the dutch
//narcissa
// bistro central parc
// http://www.timeout.com/newyork/restaurants/100-best-new-york-restaurants-american?package_page=35907

var content = ""

var menuRequest = request.post('https://api.locu.com/v2/venue/search', {form: JSON.stringify(menuData)}, function(err, httpResponse, body) {
    content = body;
});
//!!!!!!!!!!
//!!!!!!!!!!

app.listen(3000)


// module.exports = 