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
console.log(Days);
var outputArray = [];
function removeusingSet(arr) { 
  let outputArray = Array.from(new Set(arr)) 
  return outputArray 
} 
var key1;
let key=[];
let amount=[];
let bikeKey=[];
// let cost={};
db.ref('/bikesAdded/' + queries[1]).once('value').then( function (Data)  
{
  for(let i=0;i<Object.keys(Data.val()).length;i++){
    
    let bike_fetch = Object.keys(Data.val())[i];
    let bike_num = bike_fetch.split("_");
    key.push(bike_fetch  );
    bikeKey.push(bike_num[1]);
     key1=removeusingSet(bikeKey); 
    }
    
    // console.log(key1); 
    // console.log(key); 
     
  }).then(function(){

    for(let k=0;k<key1.length;k++){
      let amount1=[];
      for(let j=0;j<key.length;j++){
      db.ref('/bikesAdded/' + queries[1] + "/" + key[j]).on('value', function (Data) { //.then callback lagega key and value ke saath
      
        if(key1[k] == Data.val().bikeId){ 
        var hour1=Math.abs(hour);
        if(Days!=0 &&hour1==0)
        {
     
         if (Data.hasChild("amt_per_day")) {
           let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour1;
           let priceDay = priceD + parseInt((priceD * 10) / 100);
           amount1.push(priceDay);     
          }
          else{
            let tohour=Days*24+hour1
            let priceD =  Data.val().amt_per_hr *tohour ;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            amount1.push(priceDay);
            }
          
        }
        else if(Days!=0 && hour1>0){
          if (Data.hasChild("amt_per_day")) {
         
            let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour1;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            amount1.push(priceDay);
          }
          else{
            let tohour=Days*24+hour1
            let priceD =  Data.val().amt_per_hr *tohour ;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
           amount1.push(priceDay);
         }
       }
       else if(Days==0&&hour1>=0){
         let priceD=hour1*data.val().amt_per_hr;
         let priceDay = priceD + parseInt((priceD * 10) / 100);
         amount1.push(priceDay);
         }
        }       
      });
    }
      db.ref('/bikeList/' + key1[k]).on('value', function (data) {
        document.getElementById('yo1').innerHTML = document.getElementById('yo1').innerHTML +
        '<div class=" uk-margin-left@s uk-width-1-1@s uk-width-1-2`@m uk-width-1-3@l uk-width-1-4@xl uk-padding-small uk-margin-remove element" onclick="book(' + key1[k] +')" href="booking_login.html"' +
         '>'+
         '<div class="uk-card bor uk-card-hover uk-card-default uk-margin-remove">' +
         '   <div class="uk-card-media-top uk-width-2-3@s uk-align-center uk-margin-remove-bottom">' +
         ' <img src=' + data.val().pic + ' alt="">' +
         '</div>                        <hr class="uk-margin-remove-bottom uk-margin-small-top">' +
         '<div class="uk-card-body uk-padding-small uk-background-muted card-body">' +
         ' <h5 class="uk-margin-remove bike-name"  >' + data.val().bikeName +'</h5>'
         +'<h5 class="yo"><span class="uk-align-center uk-text-bold uk-text-small"  >Price Starting From  &#x20b9;' + Math.min(...amount1) + '</span></h5>' +
         '<div class="uk-margin-remove uk-text-small uk-text-nowrap size yo1" ><span' +
         ' uk-icon="icon: location; ratio: 0.8" class="location-icon"></span>Available in <span' +
         '  class="uk-text-warning uk-text-bold">' + queries[1] + '</span></div>' +
         ' </div>' +
         '</div>' +
        '</div>';
     });
    
  
  }
  
});


db.ref('/bikesAdded/' + queries[1]).on('child_added',function()  
{
});


function book(val4) {
  var de = val4;
  var hour1=Math.abs(hour);
  var vendorid = [];
  var price = [];
  db.ref('/bikesAdded/' + queries[1]).on('child_added', function (snapshot, hours) {
    let bike_fetch = snapshot.key;
    db.ref('/bikesAdded/' + queries[1] + "/" + bike_fetch).on('value', function (Data) {
      var clickedId = Data.val().bikeId;
      if(de == clickedId) {
        vendorid.push(bike_fetch);
        console.log(Days,hour1);
        if(Days!=0 &&hour1==0)
        {
         if (Data.hasChild("amt_per_day")) {
           console.log("only day wla");
           let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour1;
           let priceDay = priceD + parseInt((priceD * 10) / 100);
          //  document.getElementById('edit1').innerHTML="Price is With day";
           
           price.push(priceDay);     
           console.log(priceDay);
          }
          else{
            let tohour=Days*24+hour1
            let priceD =  Data.val().amt_per_hr *tohour ;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            console.log(priceDay);
            console.group("only in day  wala but in worong statement")
             price.push(priceDay);
            //  document.getElementById('edit1').innerHTML="Price is With only Hour";
            }
          
        }
        else if(Days!=0 && hour1>0){
          if (Data.hasChild("amt_per_day")) {
            console.log("days hour walaw");
            let priceD = Days * Data.val().amt_per_day + Data.val().amt_per_hr * hour1;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            console.log(priceDay);
            // document.getElementById('edit1').innerHTML="Price is With Day and hour";
            price.push(priceDay);
          }
          else{
            console.log("days hour wala but amt_per_Day  is not available");
            let tohour=Days*24+hour1
            let priceD =  Data.val().amt_per_hr *tohour ;
            let priceDay = priceD + parseInt((priceD * 10) / 100);
            console.log(priceDay);
            // document.getElementById('edit1').innerHTML="Price is With day and hour";
           price.push(priceDay);
         }
       }
       else if(Days==0&&hour1>=0){
         console.log("only hours wla");
         let priceD=hour1*data.val().amt_per_hr;
         let priceDay = priceD + parseInt((priceD * 10) / 100);
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
