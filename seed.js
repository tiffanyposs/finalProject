var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");

// db.run("INSERT INTO users (username, password, friend_list, first_name, last_name, email, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)",
// 	'tiffanyposs', 'tiffany', '2', 'Tiffany', 'Poss', 'tiffany@thissite.com', 'https://scontent-atl.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/10482599_10152725129824673_6689735394200472337_n.jpg?oh=177e6c5b40da3fc6643a633de0858c06&oe=554B619D',
// 	'joeymatt', 'joey', '1', 'Joey', 'Matt', 'joey@thissite.com', 'https://scontent-atl.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/10171822_10152801837009202_690055223794128513_n.jpg?oh=ce3e9f2c525037423c4c9d61036cb326&oe=559449FB',
// 	'auggiedoggie', 'auggie', '1', 'Auggie', 'Poss', 'auggie@thissite.com', 'https://scontent-atl.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/10478530_10152965952389673_6435211803125839061_n.jpg?oh=2a41ddcb829280abd8fa1b7e2c73e4aa&oe=554D4DC3',
// 	function(err){
// 		if(err){
// 			throw err;
// 		}
// 	}
// );



db.run("INSERT INTO friends (friend_one, friend_two) VALUES (?, ?), (?, ?)",
	1, 4, 1, 5,
	function(err){
		if(err){
			throw err;
		}
	}
)



