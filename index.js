var queryString1 = decodeURIComponent(window.location.search);
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
console.log(checkIn, checkOut, inTime, outTime);
let start = sd2[0].split("/");
let end = sd2[4].split("/");
const sdate = parseInt(start[0]);
const smonth = parseInt(start[1]);
const syear = parseInt("20" + start[2]);
const edate = parseInt(end[0]);
const emonth = parseInt(end[1]);
const eyear = parseInt("20" + start[2]);
console.log(sdate, smonth, syear);

//Getting Days From Dates
const oneDay = 24 * 60 * 60 * 1000;
const firstDate = new Date(syear, smonth - 1, sdate);
const secondDate = new Date(eyear, emonth - 1, edate);
const Days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
console.log(sd2);
console.log(firstDate);
console.log(secondDate);
console.log("total Days" + Days);

//Getting Hour From the Given Dates
var startTime = moment(inTime, "HH:mm a");
var endTime = moment(outTime, "HH:mm a");
var duration = moment.duration(endTime.diff(startTime));
var hours = parseInt(duration.asHours());
alert("number of days" + Days + "hour" + hours);
alert("Number of hours " + (Days * 24 + hours));






















var db = firebase.database();
db.ref('/bikesAdded/' + queries[1]).on('child_added', function (snapshot) {
  let bike_fetch = snapshot.key;
  let bike_num = bike_fetch.split("_");
  db.ref('/bikesAdded/' + queries[1] + "/" + bike_fetch).on('value', function (Data) {
    db.ref('/bikeList/' + bike_num[1]).on('value', function (data) {
      document.getElementById('yo1').innerHTML = document.getElementById('yo1').innerHTML +
        '<div class="uk-card uk-card-default uk-card-hover uk-card-body uk-box-shadow-medium uk-padding">' +

        '<div class="uk-card  ` -media-top">' +
        '<img class="uk-border-circle uk-align-center" src="' + data.val().pic + '"width="200px" height="50px" alt="" />' +
        '<div class="uk-card-badge uk-label" >' + data.val().manufacturer + '</div>' +
        '</div>' +
        '<p class="uk-text uk-h3 uk-text-center" >' + data.val().bikeName + '</p>' +
        '<p class="uk-h5 uk-text-secondary uk-text-bold uk-text-center">' +
        'AMOUNT:' +
        '</p>' +
        '<p class="uk-text uk-text-left" >' +
        Data.val().amt_per_hr + '/hr' +
        '</p>' +

        '<p class="uk-text ">' +
        '<span class="uk-text-bold">Total amount:</span> 2000' +
        '</p>' +
        '<button class="uk-button uk-align-center uk-button-danger">' +
        'Book Now' +
        ' </button>';

    });
  });

});

