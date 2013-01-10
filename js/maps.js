function Map(){
}
// ------------------------------------------------------------

var geocoder;
var map;


function initializeMaps() {
    geocoder = new google.maps.Geocoder();
    var centerLatLng = new google.maps.LatLng(-34.397, 150.644);//dummy lat,lng
    var mapOptions = {
        zoom: 18,
        center: centerLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

// Google Maps stuff

// get street address from LatLng
function codeLatLng(lat, lng) {
    // The GeocoderResults object literal represents a single Geocoding result and is an object of the following form:
    var results = [{
        types:[],
        formatted_address: "",
        address_components:[{
            short_name: "",
            long_name: "",
            types:[]
        }],
        geometry: {
            location: "",            //LatLng,
            location_type: {},       //GeocoderLocationType,
            viewport: "",            //LatLngBounds,
            bounds: ""               //LatLngBounds
        }
    }];


    var markerLatLng = new google.maps.LatLng(lat, lng);

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'latLng': markerLatLng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
              var marker = new google.maps.Marker({
                  position: markerLatLng,
                  map: map
              });

              $('#streetAddress').text(results[0].formatted_address);
              //alert("street address: " + results[0].formatted_address);
          }
      } else {
          alert("Geocoder failed due to: " + status);
      }
    });
}

function showAddress(latitude, longitude){
    var myLatLng = new google.maps.LatLng(latitude, longitude);
    var map = new google.maps.Map(document.getElementById('map_canvas'),{
        zoom:18,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId:google.maps.MapTypeId.ROADMAP
    });

    // set location for the marker
    codeLatLng(latitude, longitude);

    var  marker = new google.maps.Marker({
        map:map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        position: myLatLng
    });

    google.maps.event.addListener(marker, 'click', toggleBounce);

    function toggleBounce() {

        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    // find out the address
}

// html5 geolocation api stuff ------------------------------------------

function successCallback(position){
    function pad(n){return n<10 ? '0'+n : n;}
    var output = '';
    var theDate = '';
    var theTime = '';
    var date;

    output  = "<div><p>Your position has been located.</p>";
    output += "<p>Latitude: "  + position.coords.latitude  + "°</p>";
    output += "<p>Longitude: " + position.coords.longitude + "°</p>";
    output += "<p>Accuracy: "  + position.coords.accuracy  + " meters</p>";
    if (position.coords.altitude){
        output += "<p>Altitude: " + position.coords.altitude + " meters</p>";
    }
    if (position.coords.altitudeAccuracy){
        output += "<p>Altitude Accuracy: " + position.coords.altitudeAccuracy + "meters</p>";
    }
    if (position.coords.heading){
        output += "<p>Heading: " + position.coords.Heading + "°</p>";
    }
    if (position.coords.speed){
        output += "<p>Speed: " + position.coords.Speed + " m/s</p>";
    }
    date = new Date;
    theDate = date.toDateString().substring(4);
    theTime = date.toTimeString().split(" ")[0];
    output += "<p>Time of Position: " + theDate + " at " + theTime + "</div>";
    //$(output).insertBefore("#map_canvas");
    $(".ui-content").css("padding", 0);

    var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title:"Hello World!"
    });



    showAddress(position.coords.latitude, position.coords.longitude);
}

function errorCallback(error){
    alert("There was a problem getting your location: " + error.message);
}

function whereAmI(){
    var geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 45000
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, geoOptions);
}

$("#mapYourLocation").live("click",function(){
    // first change pages
    $.mobile.changePage('map.html');
    console.log("changed from index.html to map.html");
    // New get the map
    if (window.navigator.geolocation) {
        whereAmI();
    } else {
        alert("This browser does not natively support geolocation");
    }
});