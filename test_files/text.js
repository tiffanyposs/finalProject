// var menuPeople = {"menus" : {
// 	"Pasta" : {
// 		price: "12",
// 		quantity: "2",
// 		usernames: ["tiffany", "karl"]
// 		},
// 	"Salad" : {
// 		price: "23",
// 		quantity: "3",
// 		usernames: ["dawn", "karl"]
// 	},
// 	"Dessert" :	{
// 		price: "5",
// 		quantity: "3",
// 		usernames: ["dawn", "karl"]
// 	}
// 	}
// }



// console.log(menuPeople.menus.Pasta.usernames)

// var array = []

// var to_push = ["hello", "world"]

// array.push(to_push);

// console.log(array)


var MasterUser = {
	"tiffany" : {
		"avatar_url" : "http://localhost"
		"items" : {
			"salad" : {price: 4.21, quantity: 1},
			"beer" : {price: 5.32, quantity: 2}
		},
		"total" : 15.23,
		"tip" : 3,
		"tax" : 1.5,
		"grand-total": 19.76
	}
}


console.log(MasterUser.tiffany.total)