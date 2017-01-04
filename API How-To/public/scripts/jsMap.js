var map;
window.onload = function() {
	console.log(document.getElementById('test'));
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 29.976, lng: 31.132},
		zoom: 16
	});
}