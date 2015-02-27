    //this function formats the date
  var formatDate = function(date){
      var date_array = date.split("-")
      var year = date_array[0];
      var day = date_array[2];

      
      var monthObject = {
        "01" : "January ",
        "02" : "February ",
        "03" : "March ",
        "04" : "April ",
        "05" : "May ",
        "06" : "June ",
        "07" : "July ",
        "08" : "August ",
        "09" : "September ",
        "10" : "October ",
        "11" : "November ",
        "12" : "December "
      }

      var month = monthObject[date_array[1]];
      var formatted_date = month + day + ", " + year
      return formatted_date

  }//end formatDate

  //this formats the time
  var formatTime = function(time){
      var time_array = time.split(":");
      var hour = time_array[0];
      var minutes = time_array[1];

        if(hour[0] === "0"){
          hour.splice(0)
          console.log(hour)
        }

      var amPm = "";
        if(parseInt(hour) < 12){
          amPm = "am";
        }else{
          amPm = "pm";
        }


      var TimeObject = {
        "0" : "12",
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



  if(parseInt(hour) > 12 || parseInt(hour) === 0){
    hour = TimeObject[hour];
  }

  var formatted_time = hour + ":" + minutes + " " + amPm;
    return formatted_time;
  }//end formatTime

var formatDateTime = function(){
  var date = document.getElementsByClassName('date');
  var time = document.getElementsByClassName('time');

  var length = date.length;
  var i = 0;
  while(i < length){
    // console.log(date[i].innerText)
    var unformatted_date = date[i].innerText;
    var unformatted_time = time[i].innerText;

    date[i].innerText = formatDate(unformatted_date)
    time[i].innerText = formatTime(unformatted_time)
    i++;
  }
}//end formatDateTime

formatDateTime();
