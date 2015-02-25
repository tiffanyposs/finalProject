var body = document.getElementById('body');

// body.style.backgroundColor = "red";


var user_url = "/api"
var user_xhr = new XMLHttpRequest();
user_xhr.open("GET", user_url)

user_xhr.addEventListener('load', function(e){
    var d = user_xhr.responseText;
    var parsed = JSON.parse(d);
    // console.log(parsed)
    getMenu(parsed)
    getHours(parsed)
})

user_xhr.send();


//this gets the hours and returns an array of formatted days and times
//example of a string in the array: "Monday: 11:00am - 2:00am"
var getHours = function(restaurant_object){
	var Data = restaurant_object;
	if(Data['venues'][0]['open_hours']){
	var open_hours = Data['venues'][0]['open_hours'];

	var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

	var formated_days = [];
	days.forEach(function(day){
		var first_letter = day[0].toUpperCase();
		var new_day = first_letter + day.substring(1);

		var open = open_hours[day][0][0];
		var close = open_hours[day][0][1];
		//calls a function that formats the times
		open = militaryTime(open)
		close = militaryTime(close)
		var times = new_day + ": " + open + " - " + close;
		formated_days.push(times)
	})
	// console.log(formated_days)
	return formated_days
	}
	else{
	return "No Hours Available"
	}
}//end getHours


//formats the time
//takes a number in number in format 05:30
//is called from getHours
var militaryTime = function(num){
	var number = num.toString();
	//removes first zero
	if(number[0] === "0"){
		number = number.substring(1)
	}

	//adds am or pm
	if(number.length === 4){
		number += " am"
		// console.log(number)
		return number;
	}
	else{
		if(number.substring(0, 2) === "10" || number.substring(0, 2) === "11"){
			number += " am"
			// console.log(number)
			return number;
		}
		//this converts it to non-military time
		else{
			var Times = {
				"13" : "1",
				"14" : "2",
				"15" : "3",
				"16" : "4",
				"17" : "5",
				"18" : "6",
				"19" : "7",
				"20" : "8",
				"21" : "9",
				"22" : "10",
				"23" : "11"
			}
			if(number.substring(0, 2) != "12"){
				var first_half = number.substring(0, 2);
				var second_half = number.substring(3);
				var new_first = Times[first_half];
				number = new_first + ":" + second_half + " pm";
				// console.log(number);
				return number;
			}
			else{
				number += " pm";
				// console.log(number);
				return number;
			}


		}
	}
}//end militaryTime



var getMenu = function(restaurant_object){

	//this is the object name that is being appended too
	var menu_section = document.getElementById('menu_section');
	// console.log(menu_section)
	//gets the first result
	var Data = restaurant_object['venues'][0];
	console.log(Data)
	//first object


	//name
	var name = Data['name'];
	var website = Data['website_url']
	//this is set below what currency it is in if it changes
	//for now I default to "$"
	var currency = "$"

	// console.log(name)
	// console.log(website)


	//this digs into the array
	Data['menus'].forEach(function(menu){
		currency = menu['currency_symbol']
		//main menu name

		var menu_div = document.createElement('div')
		menu_div.className = "menu_name";
		menu_section.appendChild(menu_div);

		var menu_name = menu['menu_name']
		var menu_header = document.createElement('h2');
		menu_header.innerText = menu_name;
		menu_div.appendChild(menu_header);
		// console.log(menu_name)

			//SECTION FOR EACH
			menu['sections'].forEach(function(section){
				console.log(section);
				if(section['section_name'] != ""){
					var section_div = document.createElement('div')
					section_div.className = 'section_div';
					menu_section.appendChild(section_div)

					var section_header = document.createElement('h3');
					section_header.innerText = section['section_name'];
					section_div.appendChild(section_header);
				}
				//SUBSECTION FOR EACH
				section['subsections'].forEach(function(subsection){
					// console.log(subsection)
					if(subsection['subsection_name'] != ""){
						var subsection_div = document.createElement('div');
						subsection_div.className = 'subsection_div';
						menu_section.appendChild(subsection_div);

						var subsection_head = document.createElement('h4');
						subsection_head.innerText = subsection['subsection_name'];
						subsection_div.appendChild(subsection_head);
					}
						//CONTENT FOR items
						subsection['contents'].forEach(function(content){
							// console.log(content)




							if(content['name'] && content['price']){

								var item_div = document.createElement('div');
								item_div.className = 'item_div';
								menu_section.appendChild(item_div);

								var name = document.createElement('h4');
								name.innerText = content['name'];
								item_div.appendChild(name)

								var price = document.createElement('h5');
								price.innerText = currency + parseInt(content['price']).toFixed(2);
								item_div.appendChild(price)

								if(content['description']){
								var description = document.createElement('p');
								description.innerText = content['description'];
								item_div.appendChild(description)
								}


							}
							//some menus have option group
							//seems to be mostly for wines by bottle or by glass
							if(content['option_groups']){
								content['option_groups'].forEach(function(option){
									// console.log(option)
									option['options'].forEach(function(each){
									// console.log(each)
									if(each['price']){
									var item_div = document.createElement('div');
									item_div.className = 'item_div';
									menu_section.appendChild(item_div);

									var name = document.createElement('h4');
									name.innerText = content['name'];
									item_div.appendChild(name);

									var size = document.createElement('h5');
									size.innerText = each['name'];
									item_div.appendChild(size);

									var price = document.createElement('h5');
									price.innerText = currency + parseInt(each['price']);
									item_div.appendChild(price);

									if(content['description']){
										var description = document.createElement('p');
										description.innerText = content['description'];
										item_div.appendChild(description)
									}
									}	

									})
									// console.log(option)
								})

							}//end option_groups
			
					})
			})

		})

	})

}//end getMenu



