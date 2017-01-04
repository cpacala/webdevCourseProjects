/*
 * Leverages the Google Maps geocoding API to create a map and center it on
 * New York City
 *
 */
 
//call initMap when content on page has been loaded
document.addEventListener('DOMContentLoaded', initMap);

/*
 * initialize the map and geocoder object and center the map on Giza, Egypt
 */
var geocoder;
var map;
function initMap() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(29.976, 31.132);
    
    // set initial zoom distance of map and center it on the latlng coords
	var mapOptions = {
		zoom: 8,
		center: latlng
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
	codeAddress();
}

/*
 * Demonstrates how the geocoder API functions by encoding the addreess "New York City"
 * as a pair of latitude and longitdude coordinates and centers the map on the coords.
 */
function codeAddress() {
	var address = "New York City"; //This is for testing purposes, hardcoding the name is useless otherwise
    
    //geocode the address using the 'address' string.
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {        //center the map if successful call to geocoder
			map.setCenter(results[0].geometry.location);
		} else {                                                                        //print error if geocoding fails.
			console.log("Geocode not successful: " + status);
		}
	});
}