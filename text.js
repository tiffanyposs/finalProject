var menuPeople = {"menus" : {
	"Pasta" : {
		price: "12",
		quantity: "2",
		usernames: ["tiffany", "karl"]
		},
	"Salad" : {
		price: "23",
		quantity: "3",
		usernames: ["dawn", "karl"]
	},
	"Dessert" :	{
		price: "5",
		quantity: "3",
		usernames: ["dawn", "karl"]
	}
	}
}



console.log(menuPeople.menus.Pasta.usernames)


// {
//     "glossary": {
//         "title": "example glossary",
// 		"GlossDiv": {
//             "title": "S",
// 			"GlossList": {
//                 "GlossEntry": {
//                     "ID": "SGML",
// 					"SortAs": "SGML",
// 					"GlossTerm": "Standard Generalized Markup Language",
// 					"Acronym": "SGML",
// 					"Abbrev": "ISO 8879:1986",
// 					"GlossDef": {
//                         "para": "A meta-markup language, used to create markup languages such as DocBook.",
// 						"GlossSeeAlso": ["GML", "XML"]
//                     },
// 					"GlossSee": "markup"
//                 }
//             }
//         }
//     }
// }