        var url = "http://localhost:3000/api_info";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.onreadystatechange = function() {
            var d = xhr.responseText;
            var parsed = JSON.parse(d);

            // this is the object from the api
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
                                    var items = document.getElementById("purchased_items");
                                    var purchase_card = document.createElement('div');
                                    purchase_card.className = 'purchase_card'
                                    items.appendChild(purchase_card);
                                    var selected_name = document.createElement('h5');
                                    selected_name.innerText = each_three.name;
                                    purchase_card.appendChild(selected_name);
                                    var selected_price = document.createElement('p');
                                    selected_price.innerText = "$" + each_three.price;
                                    purchase_card.appendChild(selected_price)
                                    purchase_card.style.backgroundColor = 'green';
                                    counter++;

                                        //this will remove the purchased_card if hey click on it
                                        //and reactivate the original color on menu
                                        purchase_card.addEventListener('click', function(){
                                            items.removeChild(purchase_card);
                                            div.style.backgroundColor = 'cyan';
                                            counter = 0
                                        })//end event listener purchase_card

                                    }

                                })//end event listener for div
                            }//end type of if statement

                        // console.log(each_three.name)
                        // console.log(each_three.price)
                    })
                })
            })




            //this is the closest to all of the submenus, must nest the following layers
            // console.log(parsed.venues[0].menus[0].sections);
            //this is diggin in the rest of the way
            // console.log(parsed.venues[0].menus[0].sections[0].subsections[0].contents[1].name);
            // console.log(parsed.venues[0].menus[0].sections[0].subsections[0].contents[1].price);
        };


        xhr.send();


