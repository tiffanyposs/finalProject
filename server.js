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
  friends : [],
  id : 0
}

// homepage after login
app.get('/', function(req, res) {
  console.log('/')
  if(req.session.valid_user === true){
    var friends = session_info.friends;
  db.get('SELECT username, first_name, last_name, email, avatar_url FROM users WHERE username = ?', session_info.username, function(err, row){  
    var users = row;
    db.all('SELECT * FROM receipts WHERE user_id = ?', session_info.id, function(err, row){
      var receipts = row;
      console.log(receipts)
      res.render('index.ejs', {friends: friends, users: users, receipts: receipts});
    })
     //add any items to send over via ejs
    })

  }
  else{
    res.redirect('/login')
  }
});



//this allows people to load friends
app.post('/friendfinder', function(req, res){
  console.log('/find_friends')
  var friend = req.body.friend;

  db.get('SELECT id, username, first_name, last_name, email, avatar_url FROM users WHERE username = ?', friend, function(err, row){
    //if the database contains this person
    if(row){
      var exists = false;
      session_info.friends.forEach(function(friend){
        if(friend[0].username === row.username){
          exists = true;
        }
      })
      //if they are already friends with that person
      if(exists === true){
        console.log("you're already friends with that person")
        res.redirect('/');
      }
      //if they exist and they are not friends with them yet
      else{
        console.log("success!");
        var index = session_info.friends.length;
        session_info.friends.splice(0, 0, [row]);
          db.run('INSERT INTO friends(friend_one, friend_two) VALUES(?, ?)',
                   session_info['id'], row.id, function(err){
            if(err){ throw err;}
            else{
              res.redirect('/');
            }
          });
      }//end else
    }//end if row
      //refreshes the page if it doesn't exist, could trigger
      //an error message in the future. 
      else{
        res.redirect('/')
      }

    })//end db.get

})//end app.post




//login page
app.get('/login', function(req, res){
    console.log("/login")
    res.render('login.ejs');
});


//log out
app.post('/logout', function(req,res){
  req.session.valid_user = false;
  session_info.username = "";
  session_info.friends = [];
  res.redirect('/');
})


//new user post
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
    //this sets the id in the session
      db.get('SELECT * FROM users WHERE username = ?', username, function(err, row){
        if(err){ throw err }
        if(row){ 
          //captures the username for the current session
          session_info['id'] = row.id;
          console.log(session_info['id'])
        }
      })
  }
  else{
    res.redirect('/login');
  }
})//end /user post



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
      session_info['id'] = row.id;

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
    res.render('menu.ejs')
  }
  else{
    res.redirect('/')
  }
})


//this saves the menu card to the db
app.post('/menu_card', function(req,res){
  var menu = req.body.masteruser;
    db.run('INSERT INTO receipts(user_id, restaurant_object) VALUES(?, ?)',
             session_info['id'], menu, function(err){
      if(err){ throw err;}
      else{     
        db.get('SELECT * FROM receipts WHERE user_id = ? ORDER BY id DESC LIMIT 1', session_info.id, function(err, row){
          res.redirect('/receipt/' + row.id.toString())
        })
      }
    });
})

//this shows a receipt
app.get('/receipt/:id', function(req, res){
  var receipt_id = req.params.id;
  db.get('SELECT * FROM receipts WHERE id = ?', receipt_id, function(err, row){
    console.log(row);
    var receipts = row;
    if(row.user_id === session_info.id){
    res.render('receipt.ejs', {receipts: receipts})
    }
    else{
      res.redirect('/')
    }
  })
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
        friend_info.forEach(function(each){
          session_info.friends.push(each);
        })
      }
    })//end db.all

    } 

  }//end sendFriends

}// end findFriends Function
//!!!!!!!!!!!
//!!!!!!!!!!!


var content = ""

//!!!!!!!!!!
//!!!!!!!!!!
// gets the restaurant info can call with ajax
app.get('/api_info', function(req, res){
  console.log('/api_info')
  res.header('Access-Control-Allow-Origin', '*');
  res.send(content);
})



//this searches the api
app.post('/menu', function(req, res){

var restaurant = req.body.restaurant;

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
      "name": "",
      "menus" : { "$present" : true }
    }
  ]
}

menuData["venue_queries"][0]['name'] = restaurant;
// buttermilk channel
// union square cafe
// fedora
// the dutch
//narcissa
// bistro central parc


var menuRequest = request.post('https://api.locu.com/v2/venue/search', {form: JSON.stringify(menuData)}, function(err, httpResponse, body) {
    content = body
    res.redirect('/menu')

});


})

app.listen(3000)



