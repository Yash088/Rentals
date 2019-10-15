var queryString1 = decodeURIComponent(window.location.search);
// console.log(queryString1);
queryString1 = queryString1.substring(1);
var Mainqueries = queryString1.split("&");
var queries = Mainqueries[0].split("=");
var sd3 = Mainqueries[1].split("=");
let sd2 = sd3[1].split(" ");
let checkIn = sd2[0];
let checkOut = sd2[4];
let inTime = sd2[1] + sd2[2];
let outTime = sd2[5] + sd2[6];
let mode1 = sd2[2];
let mode2 = sd2[6];
// console.log(checkIn, checkOut, inTime, outTime);
let start = sd2[0].split("/");
let end = sd2[4].split("/");
const sdate = parseInt(start[0]);
const smonth = parseInt(start[1]);
const syear = parseInt("20" + start[2]);
const edate = parseInt(end[0]);
const emonth = parseInt(end[1]);
const eyear = parseInt("20" + start[2]);
// console.log(sdate, smonth, syear);

//Getting Days From Dates
const oneDay = 24 * 60 * 60 * 1000;
const firstDate = new Date(syear, smonth - 1, sdate);
const secondDate = new Date(eyear, emonth - 1, edate);
const Days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
// console.log(sd2);
// console.log(firstDate);
// console.log(secondDate);
// console.log("total Days" + Days);

//Getting Hour From the Given Dates
var startTime = moment(inTime, "HH:mm a");
var endTime = moment(outTime, "HH:mm a");
var duration = moment.duration(endTime.diff(startTime));
let hour = parseInt(duration.asHours());
// alert("number of days" + Days + "hour" + hour);

var db = firebase.database();
// console.log(hours + "Outside Function");

db.ref('/bikesAdded/' + queries[1]).on('child_added', function (snapshot) {
  let bike_fetch = snapshot.key;
  let bike_num = bike_fetch.split("_");
  db.ref('/bikesAdded/' + queries[1] + "/" + bike_fetch).on('value', function (Data) {
    db.ref('/bikeList/' + bike_num[1]).on('value', function (data) {
      // console.log(hour = "Indisde");
     var amount1=[];
    
      if(Days!=0 &&hour==0)
      {
        console.log(Days,hour);
        console.log(snapshot.key);
        console.log(Data.val().amt_per_day);
        console.log(Data.val().amt_per_hr);
       if (Data.hasChild("amt_per_day")) {
         console.log("only day wla");
         let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour;
         let priceDay = priceD + parseInt((priceD * 10) / 100);
        //  document.getElementById('edit1').innerHTML="Price is With day";
         
         amount1.push(priceDay);     
         console.log(priceDay);
        }
        else{
          let tohour=Days*24+hour
          let priceD =  Data.val().amt_per_hr *tohour ;
          let priceDay = priceD + parseInt((priceD * 10) / 100);
          console.log(priceDay);
          console.group("only in day  wala but in worong statement")
           amount1.push(priceDay);
          //  document.getElementById('edit1').innerHTML="Price is With only Hour";
          }
        
      }
      else if(Days!=0 && hour>0){
        if (Data.hasChild("amt_per_day")) {
          console.log("days hour walaw");
          let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour;
          let priceDay = priceD + parseInt((priceD * 10) / 100);
          console.log(priceDay);
          // document.getElementById('edit1').innerHTML="Price is With Day and hour";
          amount1.push(priceDay);
        }
        else{
          console.log("days hour wala but amt_per_Day  is not available");
          let tohour=Days*24+hour
          let priceD =  Data.val().amt_per_hr *tohour ;
          let priceDay = priceD + parseInt((priceD * 10) / 100);
          console.log(priceDay);
          // document.getElementById('edit1').innerHTML="Price is With day and hour";
         amount1.push(priceDay);
       }
     }
     else if(Days==0&&hour>=0){
       console.log("only hours wla");
       let priceD=hour*data.val().amt_per_hr;
       let priceDay = priceD + parseInt((priceD * 10) / 100);
       console.log(priceDay);
       amount1.push(priceDay);
      //  document.getElementById('edit1').innerHTML="Price is onlu";
       }
      
      
      
       let hours = parseInt(Days * 24 + hour);
       let pricee = Data.val().amt_per_hr * hours;
       let cost1 = pricee + parseInt(pricee * 10 / 100);
       
      document.getElementById('yo1').innerHTML = document.getElementById('yo1').innerHTML +
        '<div class=" uk-margin-left@s uk-width-1-1@s uk-width-1-2`@m uk-width-1-3@l uk-width-1-4@xl uk-padding-small uk-margin-remove element" onclick="book(' + Data.val().bikeId + "," + Data.val().amt_per_hr * hours + ')" href="booking_login.html"' +
        '>' +
        '<div class="uk-card bor uk-card-hover uk-card-default uk-margin-remove">' +
        '   <div class="uk-card-media-top uk-width-2-3@s uk-align-center uk-margin-remove-bottom">' +
        ' <img src=' + data.val().pic + ' alt="">' +
        '</div>                        <hr class="uk-margin-remove-bottom uk-margin-small-top">' +
        '<div class="uk-card-body uk-padding-small uk-background-muted card-body">' +
        ' <h5 class="uk-margin-small-bottom bike-name">' + data.val().bikeName + '<span class="uk-align-right@s uk-text-bold uk-text-small">&#x20b9;' + amount1[0] + '</span></h5>' +
        '<div class="uk-margin-remove uk-text-small uk-text-nowrap size"><span' +
        ' uk-icon="icon: location; ratio: 0.8" class="location-icon"></span>Available in <span' +
        '  class="uk-text-warning uk-text-bold">' + queries[1] + '</span></div>' +
        ' </div>' +
        '</div>' +

        '</div>';

    });
  });

});


function book(val4, val2) {
  var de = val4;
  var de2 = val2;
  var vendorid = [];
  var price = [];
  db.ref('/bikesAdded/' + queries[1]).on('child_added', function (snapshot, hours) {
    let bike_fetch = snapshot.key;
    db.ref('/bikesAdded/' + queries[1] + "/" + bike_fetch).on('value', function (Data) {
      var clickedId = Data.val().bikeId;
      let hours = parseInt(Days * 24 + hour);

      if (de == clickedId) {
        vendorid.push(bike_fetch);
        console.log(bike_fetch);
        if(Days!=0 &&hour==0)
        {
         if (Data.hasChild("amt_per_day")) {
           console.log("only day wla");
           let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour;
           let priceDay = priceD + parseInt((priceD * 10) / 100);
          //  document.getElementById('edit1').innerHTML="Price is With day";
           
           price.push(priceDay);     
           console.log(priceDay);
          }
          else{
            let tohour=Days*24+hour
            let priceD =  Data.val().amt_per_hr *tohour ;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            console.log(priceDay);
            console.group("only in day  wala but in worong statement")
             price.push(priceDay);
            //  document.getElementById('edit1').innerHTML="Price is With only Hour";
            }
          
        }
        else if(Days!=0 && hour>0){
          if (Data.hasChild("amt_per_day")) {
            console.log("days hour walaw");
            let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            console.log(priceDay);
            // document.getElementById('edit1').innerHTML="Price is With Day and hour";
            price.push(priceDay);
          }
          else{
            console.log("days hour wala but amt_per_Day  is not available");
            let tohour=Days*24+hour
            let priceD =  Data.val().amt_per_hr *tohour ;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            console.log(priceDay);
            // document.getElementById('edit1').innerHTML="Price is With day and hour";
           price.push(priceDay);
         }
       }
       else if(Days==0&&hour>=0){
         console.log("only hours wla");
         let priceD=hour*data.val().amt_per_hr;
         let priceDay = priceD + parseInt((priceD * 10) / 100);
         console.log(priceDay);
         price.push(priceDay);
        //  document.getElementById('edit1').innerHTML="Price is onlu";
         }
       
        
      }

    });
  });

  
  var id = "?bikeid=" + de + "& vendorId=" + vendorid + "& amount=" + price + "&" + Mainqueries[1] + "&" + Mainqueries[0];
  console.log(id);
  if (localStorage.getItem("num") == null) {
    localStorage.setItem("href", id);
    window.location.href = 'userauth.html';
  }
  else {
    window.location.href = 'booking.html' + id;
  }
}

// if (Data.hasChild("amt_per_day")) {
//   let day = parseInt(hours / 24);
//   console.log("day wla");

//   let Hour = hours % 24;
//   let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * Hour;
//   let priceDay = priceD + parseInt((price * 10) / 100);
//   price.push(priceDay);
// }
// else {
//   console.log("hour wala");
//   let priceF = Data.val().amt_per_hr * hours;
//   let priceFinal = priceF + parseInt((priceF * 10 / 100));
//   console.log(Data.val().amt_per_hr, hours, priceFinal);
//   price.push(priceFinal);
// }