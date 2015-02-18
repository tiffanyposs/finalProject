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
                username.innerText = each[0].username;
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
                        chosen_username.innerText = each[0].username;
                        chosen_friend.appendChild(chosen_username);

                        var chosen_image = document.createElement('img');
                        chosen_image.src = each[0].avatar_url;
                        chosen_friend.appendChild(chosen_image);
                        friend_list.removeChild(friend_div);

                        //this adds it to the ChosenFriends object
                        ChosenFriends[each[0].username] = {avatar_url: each[0].avatar_url}
                        console.log(ChosenFriends)

                        //when the added friend is clicked it is now removed
                        chosen_image.addEventListener('click', function(){
                            var friend_div = document.createElement('div');
                            friend_list.appendChild(friend_div);

                            var username = document.createElement('h3');
                            username.innerText = each[0].username;
                            friend_div.appendChild(username);

                            var image = document.createElement('img');
                            image.src = each[0].avatar_url;
                            friend_div.appendChild(image);
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
                    //could make this an array of dummy images
                    image_source = "http://www.ilikewallpaper.net/ipad-wallpapers/download/2268/Square-Pattern-ipad-wallpaper-ilikewallpaper_com.jpg";
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



        

        //below
        var url = "/api_info";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.addEventListener('load', function(e){

            var d = xhr.responseText;
            var parsed = JSON.parse(d);

            // this is the object from the api
            console.log(parsed);

            // console.log(parsed.venues[0].menus[0].sections[0].subsections[0].contents[1].name);
            // console.log(parsed.venues[0].menus[0].sections[0].subsections[0].contents[1].price);
            var digging = parsed.venues[0].menus[0].sections;
            //div or menu items on main page
            var menu_section = document.getElementById('menu');
        
            // console.log(digging)
            //this digs through all of the api and logs everything
            digging.forEach(function(each_one){
                //This is for  the section name, will save these somewhere
                // console.log(each_one.section_name)
                // console.log(each_one.subsections)
                var h3 = document.createElement('h3');
                h3.innerText = each_one.section_name;
                menu_section.appendChild(h3);

                each_one.subsections.forEach(function(each_two){

                    if(each_two.subsection_name != ""){
                        var h4 = document.createElement('h4');
                        h4.innerText = each_two.subsection_name;
                        menu_section.appendChild(h4);
                    }
                    // console.log(each_two)
                    // console.log(each_two.contents)

                    each_two.contents.forEach(function(each_three){
                        
                        if(typeof each_three.name != "undefined" && typeof each_three.price != "undefined"){
                                var div = document.createElement('div');
                                div.className = 'menu_card';
                                div.style.backgroundColor = 'cyan';
                                menu_section.appendChild(div);
                                var name = document.createElement('h5');
                                name.className = 'name'
                                var price = document.createElement('p');
                                price.className = 'price'
                                name.innerText = each_three.name;
                                price.innerText = "$" + each_three.price;
                                div.appendChild(name);
                                div.appendChild(price);
                                if(each_three.description){
                                    var description = document.createElement('p');
                                    description.innerText = each_three.description;
                                    div.appendChild(description)
                                }//end if statement
                                //this will allow you to click on the elements from the menu
                                // to add to the list
                                var counter = 0;
                                
                                div.addEventListener('click', function(){
                                    if(counter === 0){
                                    this.style.backgroundColor = 'red';
                                    // console.log(this.textContent)
                                    
                                    var item_quantity = 1;
                                    var purchase_card = document.createElement('div');
                                    purchase_card.className = 'purchase_card'
                                    items.appendChild(purchase_card);
                                    
                                    
                                    var selected_name = document.createElement('h5');
                                    selected_name.innerText = each_three.name;
                                    purchase_card.appendChild(selected_name);
                                    var selected_price = document.createElement('p');
                                    
                                    selected_price.innerText = "$" + each_three.price + " x " + item_quantity;
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
                                            selected_price.innerText = "$" + each_three.price + " x " + item_quantity;
                                            Prices[each_three.name][1] = item_quantity;
                                            addTotal();
                                        })
                                        sub_button.addEventListener('click', function(){
                                            if(item_quantity > 1){
                                            item_quantity -= 1;
                                            selected_price.innerText = "$" + each_three.price + " x " + item_quantity;
                                            Prices[each_three.name][1] = item_quantity;
                                            addTotal();
                                            }
                                        })


                                    purchase_card.appendChild(add_button);
                                    purchase_card.style.backgroundColor = 'green';
                                    //Prices object outside of this big function
                                    //this puts a key:value pair for each one
                                    Prices[each_three.name] = [each_three.price, 1];
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
                                            div.style.backgroundColor = 'cyan';
                                            deleteTotal(each_three);
                                            // console.log(Prices);
                                            counter = 0
                                        })//end event listener purchase_card

                                    }

                                })//end event listener for div
                            }//end type of if statement
                    })
                })
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
            var deleteTotal = function(each_three){
                //this subtracts from the total
                //this deletes that element from the Prices Object
                Total -= (each_three.price * Prices[each_three.name][1]);
                //sets the total on the ejs file
                total_amount.innerText = "$" + Total;
                delete Prices[each_three.name]
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
                    purchase_card.style.backgroundColor = 'green';
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

        //calculate
        var calc_button = document.getElementById('calc_button')
        var menu = document.getElementById('menu');
        calc_button.addEventListener('click', function(){
            //removes menu section
            menu_container.removeChild(purchased_container)
            menu_container.removeChild(menu);
            var total_div = document.createElement('div');
            total_div.className = "col-md-3";
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
                final_card.style.backgroundColor = "cyan"
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

                    image.addEventListener('click', function(){
                        var index = avatar_url_array.indexOf(each_img)
                        var added_name = name_array[index];
                        if(has_eaten === false){
                            image.style.border = "2px solid red";
                            has_eaten = true;


                            //this pushes the usernames selected to the appropriate
                            //menus item user array
                            MasterMenu.menus[each].usernames.push(added_name)
                            // console.log(MasterMenu.menus[each].usernames)
                            // MasterMenu.menus[each].usernames.push(name_array[index])
                            console.log("added " + MasterMenu.menus[each])
                        }
                        else{
                            for(var i = 0; i < MasterMenu.menus[each].usernames.length; i++){
                                // console.log(MasterMenu.menus[each].usernames[i])
                                // console.log(added_name);
                                if(MasterMenu.menus[each].usernames[i] === added_name){
                                    MasterMenu.menus[each].usernames.splice(i, 1);
                                }
                            }
                            // console.log(MasterMenu.menus[each].usernames)
                            image.style.border = "none";
                            has_eaten = false;
                            console.log("subtracted " + MasterMenu.menus[each])
                        }
                    })


                    })
                x++;
             })   
                

            // console.log(menu_container.childNodes);

            var total_price = document.createElement('h3');
            total_price.innerText = "Total: $" + Total.toFixed(2);
            total_div.appendChild(total_price)


            //default tax amount nyc
            var tax = Total * 0.08875;
            var tax_amount = document.createElement('h4')
            tax_amount.innerText = "Tax: $" + tax.toFixed(2);
            total_div.appendChild(tax_amount);

            //default to 20% for now
            var tip = (Total + tax) * 0.20;
            var tip_amount = document.createElement('h4')
            tip_amount.innerText = "Tip: $" + tip.toFixed(2);
            total_div.appendChild(tip_amount);


            var grandtotal = Total + tax + tip;
            var grandtotal_amount = document.createElement('h4')
            grandtotal_amount.innerText = "Grand Total: $" + grandtotal.toFixed(2);
            total_div.appendChild(grandtotal_amount);

                        //removes friends
            var friend_container = document.getElementById('friend_container');
            friend_container.removeChild(friend_list)
            // menu_container.removeChild(friend_container);


        })// end calculate button event listener


