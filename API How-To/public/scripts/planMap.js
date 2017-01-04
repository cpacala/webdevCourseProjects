/*
 * planMap leverages the Google Maps geocoder API to allow a User to create a simple "trip planner"
 * the planner allows the user to add an address using plaintext (instead of latlng coordinates)
 * and center a google map to any point they already added to the planner.
 * planners are stored locally, this is solely a demonstration for the How To guide.
 */

//initialize map and geocoder when DOM is finished loading
document.addEventListener("DOMContentLoaded", initMap);
//add address to planner when addLoc button is clicked
document.getElementById("addLoc").addEventListener("click", addAddress);

var geocoder;
var map;
var numItems = 0;

/*
 * initialize the map and geocoder object and center the map on Giza, Egypt
 */
function initMap() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.712, -74.006);
	var mapOptions = {
		zoom: 8,
		center: latlng
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

/*
 * Add address to the map object and center address on map. Add new item to planner
 */
function addAddress() {
	event.preventDefault();
	var address = document.getElementById("address").value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);       //center map on returned LatLng location
			addItem(address, results[0].geometry.location);  //add item to list
		} else {
			console.log("Geocode not successful: " + status);
		}
	});
}

/*
 * add passed address to planner
 */
function addItem(address, latLng) {
	//add address text to list item
	var item = document.createElement("li");
	var text = document.createElement("h4");
	text.textContent = address;
	item.appendChild(text);

	//add load button to list item
	++numItems;
	var button = document.createElement("input");
	button.setAttribute("id", "button" + numItems);
	button.setAttribute("type", "submit");
	button.setAttribute("value", "Load Location");
	button.setAttribute("data-latlng", JSON.stringify(latLng)); //save LatLng object as JSON string in a data attribute
	button.addEventListener("click", loadAddress);
	item.appendChild(button);
	
	//add delete button to list item
	var delBut = document.createElement("input");
	delBut.setAttribute("id", "delBut" + numItems);
	delBut.setAttribute("type", "submit");
	delBut.setAttribute("value", "Delete Location");
	delBut.addEventListener("click", delAdd);
	item.appendChild(delBut);
	
	//add list item to list
	var list = document.getElementById("tripList");
	list.appendChild(item);
}

/*
 * load address from button that triggered click event listener into map
 */
function loadAddress(){
	event.preventDefault();
	var button = document.getElementById(this.id);
	map.setCenter(JSON.parse(button.dataset.latlng)); //convert JSON string in data attribute to LatLng object and center map on coords
}

/*
 * delete list item from list (header and 2 buttons)
 */
function delAdd(){
	event.preventDefault();
	var li = document.getElementById(this.id).parentNode;
	li.parentNode.removeChild(li);
	--numItems;
}