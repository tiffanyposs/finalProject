        var MainUser = {}

        var user_url = "/api_user_info"
        var user_xhr = new XMLHttpRequest();
        user_xhr.open("GET", user_url)

        user_xhr.addEventListener('load', function(e){
            var d = user_xhr.responseText;
            var user_info = JSON.parse(d);
            MainUser = user_info;
            console.log(MainUser)
        })

        user_xhr.send();


        //THIS POPULATES THE FRIENDS
        //friends api call sent from server
        //this populates the friends on the page
        var ChosenFriends = {}

        var friends_url = "/api_friends"
        var friends_xhr = new XMLHttpRequest();
        friends_xhr.open("GET", friends_url)

        var friend_list = document.getElementById('friend_list');
        //gets added friends list from menu.ejs
        var new_friend_div = document.getElementById('chosen_friends');

        friends_xhr.addEventListener('load', function(e){
            var d = friends_xhr.responseText;
            var friends = JSON.parse(d);

 

            //populates the friend from the server
            friends.forEach(function(each){
                var friend_div = document.createElement('div');
                friend_list.appendChild(friend_div);

                var username = document.createElement('h3');
                username.innerText = "@" + each[0].username;
                friend_div.appendChild(username);

                var image = document.createElement('img');
                image.src = each[0].avatar_url;
                friend_div.appendChild(image);
                //checked marks if the person has checked our not

            //when you click on a friend
             friend_div.addEventListener('click', function(){
                        //this is the card div
                        var chosen_friend = document.createElement('div')
                        new_friend_div.appendChild(chosen_friend);

                        var chosen_username = document.createElement('h3');
                        chosen_username.innerText = "@" + each[0].username;
                        chosen_friend.appendChild(chosen_username);

                        var chosen_image = document.createElement('img');
                        chosen_image.src = each[0].avatar_url;
                        chosen_friend.appendChild(chosen_image);
                        // friend_list.removeChild(friend_div);
                        friend_div.style.display = "none"

                        //this adds it to the ChosenFriends object
                        ChosenFriends[each[0].username] = {avatar_url: each[0].avatar_url}
                        console.log(ChosenFriends)

                        //when the added friend is clicked it is now removed
                        //issue with the 
                        chosen_image.addEventListener('click', function(){
                            friend_div.style.display = "inline"
                            //removes it from the chosen list
                            new_friend_div.removeChild(chosen_friend);
                            //deltes it form the ChosenFriends object
                            delete ChosenFriends[each[0].username]
                            console.log(ChosenFriends)
                        })

                    

                })


            })
            
        selfBox()

        })

        friends_xhr.send();
        //end friends api call

        var url_array = ["http://image-cdn.zap2it.com/images/brick-tamland-anchorman-steve-carell.jpg",
                        "http://www.heyuguys.com/images/2010/07/Paul-Rudd-Brian-Fantana.jpg",
                        "http://content8.flixster.com/question/55/01/41/5501410_std.jpg",
                        "http://www.redfm.ie/wp-content/uploads/2013/05/Anchorman.jpg",
                        "http://vignette1.wikia.nocookie.net/anchorman/images/e/ec/Veronica-corningstone1.jpg/revision/latest?cb=20120329161624"]
        var url_index = 0
        // this is for adding additional friends
        var selfBox = function(){
            //input and button from ejs file
            var name_input = document.getElementById('add_friends')
            var name_button = document.getElementById('add_friend_button')

            name_button.addEventListener('click', function(){
                if(name_input.value != ""){

                    var friend_div = document.createElement('div');
                    new_friend_div.appendChild(friend_div);

                    var initials = document.createElement('h3');
                    var name = name_input.value;
                    initials.innerText = name;
                    friend_div.appendChild(initials);

                    var image = document.createElement('img');

                    //this is the array above of images for the 
                    //dummy images fror non-existing friends.
                    image_source = url_array[url_index];
                    if(url_index === url_array.length - 1){
                        url_index = 0;
                    }
                    else{
                        url_index += 1
                    }
                    image.src = image_source;
                    friend_div.appendChild(image);

                    name_input.value = "";

                    //adds friends to the ChosenFriends object
                    ChosenFriends[name] = {avatar_url: image_source};
                    console.log(ChosenFriends);
                }
                //removes the element from the screen
                image.addEventListener('click', function(){
                    new_friend_div.removeChild(friend_div);

                    //deletes friends from ChosenFriends object
                    delete ChosenFriends[name];
                    console.log(ChosenFriends)
                })

            })

        };
        //END FRIENDS SECTION
        //!!!!!!!!!!!!!!!!!!!!

        //this converts military time to nicely formatted time
        //called from getHours
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


        //this will format hours
        var getHours = function(restaurant_object){
            var open_hours = restaurant_object;

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
            
        }//end getHours


        //this adds up all the Prices, global
        var Prices = {};
        //running internal total
        var Total = 0;
        //total element on ejs file
        var total_amount = document.getElementById('total_amount');
        //purchased_items
        var items = document.getElementById("purchased_items");
        //this is the element that holds all of the elements on the main page.
        var menu_container = document.getElementById('menu_container');
        var purchased_container = document.getElementById('purchased_container');

        var restaurant_name = "";
        var restaurant_website = "";
        var restaurant_hours = [];

        
 
        //below
        var url = "/api_info";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.addEventListener('load', function(e){

            var d = xhr.responseText;
            var parsed = JSON.parse(d);

            // this is the object from the api
            console.log(parsed);

            //div or menu items on main page
            var menu_section = document.getElementById('menu');
        
            var Data = parsed['venues'][0];
            console.log(Data)

            var name = Data['name'];
            restaurant_name = name;
            // console.log(name)
            if(Data['website_url']){
                var website = Data['website_url']
                restaurant_website = website;
            }

            if(Data['open_hours']){
                var open_hours = Data['open_hours'];
                var formatted_hours = getHours(open_hours)
                restaurant_hours = formatted_hours;
            }
            // console.log(website)

            // var hours = Data['']


            Data['menus'].forEach(function(menu){
                currency = menu['currency_symbol']
                //main menu name

                var menu_div = document.createElement('div')
                menu_div.className = "section_name";
                menu_section.appendChild(menu_div);

                var menu_name = menu['menu_name']
                var menu_header = document.createElement('h3');
                menu_header.innerText = menu_name;
                menu_div.appendChild(menu_header);


                     menu['sections'].forEach(function(section){
                        console.log(section);
                        if(section['section_name'] != ""){
                            var section_div = document.createElement('div')
                            section_div.className = 'menu_section_div';
                            menu_section.appendChild(section_div)

                            var section_header = document.createElement('h4');
                            section_header.innerText = section['section_name'];
                            section_div.appendChild(section_header);
                        }
                        section['subsections'].forEach(function(subsection){
                                // console.log(subsection)
                                if(subsection['subsection_name'] != ""){
                                    var subsection_div = document.createElement('div');
                                    subsection_div.className = 'subsection_div';
                                    menu_section.appendChild(subsection_div);

                                    var subsection_head = document.createElement('h4');
                                    subsection_head.innerText = subsection['subsection_name'];
                                    subsection_div.appendChild(subsection_head);
                                }//end if statement


                        //CONTENT FOR items
                        subsection['contents'].forEach(function(content){
                            // console.log(content)

                            if(content['name'] && content['price']){

                                var item_div = document.createElement('div');
                                item_div.className = 'menu_card';
                                menu_section.appendChild(item_div);

                                var name = document.createElement('h4');
                                name.innerText = content['name'];
                                item_div.appendChild(name)

                                var price = document.createElement('h5');
                                price.innerText = currency + content['price'];
                                item_div.appendChild(price)

                                if(content['description']){
                                var description = document.createElement('p');
                                description.innerText = content['description'];
                                item_div.appendChild(description)
                                }

                                var counter = 0;
                                ///EVENT LISTENER
                                item_div.addEventListener('click', function(){
                                    if(counter === 0){
                                    this.style.backgroundColor = '#53B8A5';
                                    // console.log(this.textContent)
                                    
                                    var item_quantity = 1;
                                    var purchase_card = document.createElement('div');
                                    purchase_card.className = 'purchase_card'
                                    items.appendChild(purchase_card);
                                    
                                    
                                    var selected_name = document.createElement('h5');
                                    selected_name.innerText = content['name'];
                                    purchase_card.appendChild(selected_name);
                                    var selected_price = document.createElement('p');
                                    
                                    selected_price.innerText = "$" + content['price'].split(" ")[0] + " x " + item_quantity;
                                    purchase_card.appendChild(selected_price)
                                    

                                    //buttons
                                    var add_button = document.createElement('button');
                                    add_button.className = "add_button";
                                    add_button.innerText = "+";
                                    purchase_card.appendChild(add_button);
                                    var sub_button = document.createElement('button');
                                    sub_button.className = "sub_button";
                                    sub_button.innerText = "-";
                                    purchase_card.appendChild(sub_button);

                                        add_button.addEventListener('click', function(){
                                            item_quantity += 1;
                                            selected_price.innerText = "$" + content['price'] + " x " + item_quantity;
                                            Prices[content['name']][1] = item_quantity;
                                            addTotal();
                                        })
                                        sub_button.addEventListener('click', function(){
                                            if(item_quantity > 1){
                                            item_quantity -= 1;
                                            selected_price.innerText = "$" + content['price'] + " x " + item_quantity;
                                            Prices[content['name']][1] = item_quantity;
                                            addTotal();
                                            }
                                        })


                                    purchase_card.appendChild(add_button);
                                    //Prices object outside of this big function
                                    //this puts a key:value pair for each one
                                    Prices[content['name']] = [content['price'].split(" ")[0], 1];
                                    //this loops through the prices and adds the total

                                    addTotal();
                                    console.log(Total)
                                    counter++;

                                        //remove button
                                        //this will remove the purchased_card if hey click on it
                                        //and reactivate the original color on menu
                                        var remove_button = document.createElement('button');
                                        remove_button.className = "remove_button";
                                        remove_button.innerText = 'Delete';
                                        purchase_card.appendChild(remove_button)
                                        remove_button.addEventListener('click', function(){
                                            items.removeChild(purchase_card);
                                            item_div.style.backgroundColor = '#C2DED4';
                                            deleteTotal(content);
                                            // console.log(Prices);
                                            counter = 0;
                                        })//end event listener purchase_card

                                    }

                                })//end event listener for div
                                ///END EVENT LISTENER


                            }
                            //some menus have option group
                            //seems to be mostly for wines by bottle or by glass
                            if(content['option_groups']){
                                content['option_groups'].forEach(function(option){
                                    // console.log(option)
                                    option['options'].forEach(function(each){
                                    // console.log(each)
                                    if(each['price'] && each['price'] != 'n/a'){
                                    var option_div = document.createElement('div');
                                    option_div.className = 'menu_card';
                                    menu_section.appendChild(option_div);

                                    var name = document.createElement('h4');
                                    name.innerText = content['name'];
                                    option_div.appendChild(name);

                                    var size = document.createElement('h5');
                                    size.innerText = each['name'];
                                    option_div.appendChild(size);

                                    var price = document.createElement('h5');
                                    price.innerText = currency + each['price'].split(' ')[0];
                                    option_div.appendChild(price);

                                    if(content['description']){
                                        var description = document.createElement('p');
                                        description.innerText = content['description'];
                                        option_div.appendChild(description)
                                    }
                                    var option_counter = 0;

                                option_div.addEventListener('click', function(){
                                    if(option_counter === 0){
                                    this.style.backgroundColor = '#53B8A5';
                                    // console.log(this.textContent)
                                    
                                    var item_quantity = 1;
                                    var purchase_card = document.createElement('div');
                                    purchase_card.className = 'purchase_card'
                                    items.appendChild(purchase_card);
                                    
                                    
                                    var selected_name = document.createElement('h5');
                                    selected_name.innerText = content['name'] + " " + each['name'];
                                    purchase_card.appendChild(selected_name);

                                    var selected_price = document.createElement('p');
                                    selected_price.innerText = "$" + each['price'].split(' ')[0] + " x " + item_quantity;
                                    purchase_card.appendChild(selected_price)
                                    

                                    //buttons
                                    var add_button = document.createElement('button');
                                    add_button.className = "add_button";
                                    add_button.innerText = "+";
                                    purchase_card.appendChild(add_button);
                                    var sub_button = document.createElement('button');
                                    sub_button.className = "sub_button";
                                    sub_button.innerText = "-";
                                    purchase_card.appendChild(sub_button);
                                    purchase_card.appendChild(add_button);

                                        add_button.addEventListener('click', function(){
                                            item_quantity += 1;
                                            selected_price.innerText = "$" + each['price'] + " x " + item_quantity;
                                            Prices[content['name'] + " " + each['name']][1] = item_quantity;
                                            addTotal();
                                        })
                                        sub_button.addEventListener('click', function(){
                                            if(item_quantity > 1){
                                            item_quantity -= 1;
                                            selected_price.innerText = "$" + each['price'] + " x " + item_quantity;
                                            Prices[content['name'] + " " + each['name']][1] = item_quantity;
                                            addTotal();
                                            }
                                        })

                                    console.log( "403 " + each['price'] )
                             
                                    //this loops through the prices and adds the total

                                    addTotal();

                                    //Prices object outside of this big function
                                    //this puts a key:value pair for each one
                                    Prices[content['name'] + " " + each['name']] = [each['price'].split(' ')[0], 1];
                                    //this loops through the prices and adds the total

                                    addTotal();
                                    console.log(Total + "initial add")
                                    option_counter++;

                                        //remove button
                                        //this will remove the purchased_card if hey click on it
                                        //and reactivate the original color on menu
                                        var delete_button = document.createElement('button');
                                        delete_button.className = "remove_button";
                                        delete_button.innerText = 'Delete';
                                        purchase_card.appendChild(delete_button)
                                        delete_button.addEventListener('click', function(){
                                            items.removeChild(purchase_card);
                                            option_div.style.backgroundColor = '#C2DED4';

                                            //this subtracts from the total
                                            //this deletes that element from the Prices Object
                                            console.log("before delete " + Total)
                                            Total -= (each['price'] * Prices[content['name'] + " " + each['name']][1]);
                                            console.log("after delete" + Total)
                                            //sets the total on the ejs file
                                            total_amount.innerText = "$" + Total;
                                            delete Prices[content['name'] + " " + each['name']]
                                            

                                            option_counter = 0;
                                        })//end event listener purchase_card

                                    }

                                })//end event listener for div
                                ///END EVENT LISTENER


                                    }   

                                    })
                                    // console.log(option)
                                })

                            }//end option_groups
            
                    })//end contents



                        })//end subsections

                    })//end sections
            })


        });//end xhr for

            xhr.send();




            //this adds the total to the page and removes the keys from prices
            var addTotal = function(){
                Total = 0;
                for (var key in Prices) {
                    if (Prices.hasOwnProperty(key)){
                        console.log(Prices[key][0])
                        var amount = Prices[key][0] * Prices[key][1];
                        Total += amount;
                        //sets the total on ejs file
                        total_amount.innerText = "$" + Total.toFixed(2);                                           
                    }   
                }
            }

            //this deletes the object and redoes the total (need to feed it the thing to be removed)
            var deleteTotal = function(content){

                //this subtracts from the total       
                //this deletes that element from the Prices Object
                Total -= (content['price'].split(" ")[0] * Prices[content['name']][1]);
                //sets the total on the ejs file
                total_amount.innerText = "$" + Total;
                delete Prices[content['name']]
                console.log(Total)
            }



            //input boxes adding menu items manually
            var added_item = document.getElementById('added_item');
            var price_item = document.getElementById('price_item');
            var quantity_item = document.getElementById('quantity_item');
            var submit_item = document.getElementById('submit_item');
            var warning = document.getElementById('warning')

            submit_item.addEventListener('click', function(){
                var warning_msg = document.getElementById('warning');
                if(added_item.value != "" && price_item.value != "" && quantity_item.value != ""){
                    warning_msg.innerText = "";
                    var purchase_card = document.createElement('div');
                    purchase_card.className = 'purchase_card'
                    items.appendChild(purchase_card);

                    var item_object = {
                        name : added_item.value,
                        price : price_item.value,
                        quantity : parseInt(quantity_item.value)
                    }

                    var selected_name = document.createElement('h5');
                    selected_name.innerText = item_object.name;
                    purchase_card.appendChild(selected_name);
                    var selected_price = document.createElement('p');
                    selected_price.innerText = "$" + item_object.price + " x " + item_object.quantity;
                    purchase_card.appendChild(selected_price)
                    purchase_card.style.backgroundColor = '#53B8A5';
                    console.log(Prices);
                    Prices[item_object.name] = [item_object.price, parseInt(item_object.quantity)];
                    added_item.value = "";
                    price_item.value = "";
                    quantity_item.value = "";
                    addTotal();

                    //add subtract buttons
                    var add_button = document.createElement('button');
                    add_button.className = "add_button";
                    add_button.innerText = "+";
                    purchase_card.appendChild(add_button);
                    var sub_button = document.createElement('button');
                    sub_button.className = "sub_button";
                    sub_button.innerText = "-";
                    purchase_card.appendChild(sub_button);

                        add_button.addEventListener('click', function(){
                            item_object.quantity += 1;
                            selected_price.innerText = "$" + item_object.price + " x " + item_object.quantity;
                            Prices[item_object.name][1] = item_object.quantity;
                            addTotal();
                        })
                        sub_button.addEventListener('click', function(){
                            if(item_object.quantity > 1){
                            item_object.quantity -= 1;
                            selected_price.innerText = "$" + item_object.price + " x " + item_object.quantity;
                            Prices[item_object.name][1] = item_object.quantity;
                            addTotal();
                            }
                        })


                    //remove buttons
                    var remove_button = document.createElement('button');
                    remove_button.className = "remove_button";
                    remove_button.innerText = 'Delete';
                    purchase_card.appendChild(remove_button)
                    remove_button.addEventListener('click', function(){
                        items.removeChild(purchase_card);
                        deleteTotal(item_object)
                    })

                }else{
                    warning_msg.innerText = "You must fill in all fields";
                    warning_msg.style.color = 'red';
                }

            })//end on click event for submit_items

        //this is the finalized menu hash that will include
        //will populate something like this;
        //     var menuPeople = {"menus" : {
        // "Pasta" : {
        //     price: "12",
        //     quantity: "2",
        //     usernames: ["tiffany", "karl"]
        //     },
        // "Salad" : {
        //     price: "23",
        //     quantity: "3",
        //     usernames: ["dawn", "karl"]
        // },

        // }
        // }
        var MasterMenu ={
            "menus": {}
        }




// var MasterUser = {
//     "tiffany" : {
//         "avatar_url" : "http://localhost"
//         "items" : {
//             "salad" : {price: 4.21, quantity: 1},
//             "beer" : {price: 5.32, quantity: 2}
//         },
//         "total" : 15.23,
//         "tip" : 3,
//         "tax" : 1.5,
//         "grand-total": 19.76
//     }
// }

        //example format above
        //this contains all the data for that user
        var MasterUser = {
            restaurant_info: {},
            diners: {},
            totals: {}
        };
        //this contains the data for the totals
        var MasterTotal = {}


        //calculate
        var calc_button = document.getElementById('calc_button')
        var menu = document.getElementById('menu_area');
        calc_button.addEventListener('click', function(){
            //removes menu section
            menu_container.removeChild(purchased_container)
            menu_container.removeChild(menu);
            var total_div = document.createElement('div');
            total_div.className = "col-md-4 col-md-offset-4";
            total_div.id = "final_count"


            var total_header = document.createElement('h2');
            total_header.id = 'total_header';
            total_header.innerText = "Who had what?";
            total_div.appendChild(total_header);

            menu_container.appendChild(total_div);

            var names = []
            var prices = []
            var quantity = []


            for ( value in Prices ) {
                names.push(value);
                prices.push(Prices[value][0]);
                quantity.push(Prices[value][1]);

                MasterMenu.menus[value] = { price: Prices[value][0], quantity: Prices[value][1], usernames: []};
                // console.log(MasterMenu.menus.value) 
            }

            // counter inside of the for each loop
            var x = 0;
            names.forEach(function(each){

                var final_card = document. createElement('div');
                final_card.className = "final_card"
                // final_card.style.backgroundColor = "cyan";
                total_div.appendChild(final_card);

                
                var title = document.createElement('h4');
                title.innerText = each;
                final_card.appendChild(title);
                var amount = document.createElement('p');
                amount.innerText = "$" + prices[x] + " x " + quantity[x];
                final_card.appendChild(amount)

                var name_array = []
                var avatar_url_array = []

                for( key in ChosenFriends){
                    name_array.push(key)
                    avatar_url_array.push(ChosenFriends[key].avatar_url)
                    // console.log(name_array);
                    // console.log(avatar_url_array)
                }

                avatar_url_array.forEach(function(each_img){
                    var image = document.createElement('img');
                    image.src = each_img;
                    final_card.appendChild(image)
                    var has_eaten = false

                    //this event listener adds and subtracts each
                    //friend from the MasterMenu object so you know who got what.
                    image.addEventListener('click', function(){
                        var index = avatar_url_array.indexOf(each_img)
                        var added_name = name_array[index];
                        if(has_eaten === false){
                            image.style.border = "2px solid #53B8A5";
                            has_eaten = true;
                            var to_push = [added_name, each_img]
                            MasterMenu.menus[each].usernames.push(to_push)
                            console.log("added " + MasterMenu.menus[each].usernames)
                        }
                        else{
                            for(var i = 0; i < MasterMenu.menus[each].usernames.length; i++){
                                if(MasterMenu.menus[each].usernames[i][0] === added_name){
                                    MasterMenu.menus[each].usernames.splice(i, 1);
                                }
                            }
                            image.style.border = "none";
                            has_eaten = false;
                            console.log("subtracted " + MasterMenu.menus[each].usernames)
                        }
                    })


                    })
                x++;
             })   
                

            // console.log(menu_container.childNodes);


            var total_price = document.createElement('h3');
            total_price.innerText = "Total: $" + Total.toFixed(2);
            total_div.appendChild(total_price)
            MasterTotal.total = total_price;

            //default tax amount nyc
            var tax = Total * 0.08875;
            var tax_amount = document.createElement('h4')
            tax_amount.innerText = "Tax: $" + tax.toFixed(2);
            total_div.appendChild(tax_amount);
            MasterTotal.total_tax = tax;

            //default to 15% for now
            var tip = (Total + tax) * 0.15;
            var tip_amount = document.createElement('h4')
            tip_amount.innerText = "Tip: $" + tip.toFixed(2);
            total_div.appendChild(tip_amount);
            MasterTotal.total_tip = tip;


            var grandtotal = Total + tax + tip;
            var grandtotal_amount = document.createElement('h4')
            grandtotal_amount.innerText = "Grand Total: $" + grandtotal.toFixed(2);
            total_div.appendChild(grandtotal_amount);
            MasterTotal.the_grandtotal = grandtotal;


                        //removes friends
            var choosen_friends = document.getElementById('friends_chosen_container');
            menu_container.removeChild(choosen_friends)
            // menu_container.removeChild(friend_container);

            var friend_container = document.getElementById('friend_container');
            menu_container.removeChild(friend_container)



            //this is the finalized button that will calculate the amounts owned
            var final_button = document.createElement('button');
            final_button.innerText = "Finished";
            final_button.id = "final_button"
            total_div.appendChild(final_button);


            //event listener that calculates each
            final_button.addEventListener('click', function(){
                // console.log(MasterMenu);
                var menu_item_array = []
                for ( key in MasterMenu.menus ) {
                    menu_item_array.push(key)
                }

                menu_item_array.forEach(function(menu_item){
                    // console.log(menu_item);
                    // console.log(MasterMenu.menus[menu_item]);
                    var final_price = MasterMenu.menus[menu_item].price;
                    var final_quantity = MasterMenu.menus[menu_item].quantity;
                    var item_total = final_price * final_quantity;
                    // console.log(item_total);

                    var diners = MasterMenu.menus[menu_item].usernames;
                    // console.log(diners)

                    var owed_each = item_total / diners.length;
                    // console.log(owed_each);

                    var quantity_each = final_quantity / diners.length

                    diners.forEach(function(diner){
                            // console.log(menu_item)
                            if(!MasterUser['diners'][diner[0]]){

                            MasterUser['diners'][diner[0]] = {};
                            MasterUser['diners'][diner[0]].avatar_url = diner[1];
                            MasterUser['diners'][diner[0]].items = {};
                            MasterUser['diners'][diner[0]].items[menu_item] = {total_owed: owed_each, quantity_eaten: quantity_each}
                            }
                            else{
                            MasterUser['diners'][diner[0]].items[menu_item] = {total_owed: owed_each, quantity_eaten: quantity_each}
                            }

                    })

                })


                //this part is for making the total in the MasterUserhash
                var users = []
                for( key in MasterUser['diners']){
                    users.push(key)
                }
                users.forEach(function(user){
                    // console.log(MasterUser[user].items)
                    var total_tally = 0;
                    for( item in MasterUser['diners'][user].items){
                        // console.log(item)
                       // console.log(MasterUser[user].items[item])
                        total_tally += MasterUser['diners'][user].items[item].total_owed;
                        
                    }
                    MasterUser['diners'][user]["total"] = total_tally;
                    MasterUser['diners'][user]["tax"] = MasterUser['diners'][user]["total"] * 0.08875;
                    MasterUser['diners'][user]["tip"] = (MasterUser['diners'][user]["total"] + MasterUser['diners'][user]["tax"]) * 0.15;
                    MasterUser['diners'][user]["grand-total"] = MasterUser['diners'][user]["total"] +  MasterUser['diners'][user]["tax"] + MasterUser['diners'][user]["tip"];
                })
                // console.log(users)
                // console.log(key)
                MasterUser['totals']['total'] = Total;
                MasterUser['totals']['tax'] = tax;
                MasterUser['totals']['tip'] = tip;
                MasterUser['totals']['grand_total'] = grandtotal;

                //these are defined globally
                MasterUser['restaurant_info']['name'] = restaurant_name;
                MasterUser['restaurant_info']['website'] = restaurant_website;
                MasterUser['restaurant_info']['hours'] = restaurant_hours;


                console.log(MasterUser)
                //this calls the form to sumit info.
                finalCalculation();
            })


        })// end calculate button event listener




// var MasterUser = {
//     "tiffany" : {
//         "avatar_url" : "http://localhost"
//         "items" : {
//             "salad" : {price: 4.21, quantity: 1},
//             "beer" : {price: 5.32, quantity: 2}
//         },
//         "total" : 15.23,
//         "tip" : 3,
//         "tax" : 1.5,
//         "grand-total": 19.76
//     }
        // final_grand_tax: 32,
        // final_grand_tip: 4.3,
        // final_grand_total: 36.64
// }

 
//this function will load everthing for the final tally
//(also need to send this to the server)
var finalCalculation = function(){

    var form = document.createElement("form");
    input = document.createElement("input");

    form.action = "menu_card";
    form.method = "post";

    input.name = "masteruser";
    input.value = JSON.stringify(MasterUser);
    input.setAttribute("type", "hidden");
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();


}

