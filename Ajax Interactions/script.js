/*
 * Uses AJAX to GET weather data from the openweathermap.org weather data
 * for the input city zipcode or name.
 *
 * Uses AJAX to POST to httpbin.org to test the POST request is successful.
 */

var apiKey = 'KEYHERE'; //API key for the openweathermap.org API

document.addEventListener('DOMContentLoaded', bindButtons);

/*
 * Bind the Get and Post buttons when the page has loaded
 */
function bindButtons()
{
	bindGetButton();
	bindPostButton();
}

/*
 * Request weather data for the city name or zip code user inputs
 * Displays the city weather, temperature, current weather, and humidity
 */
function bindGetButton()
{
	document.getElementById("weathSub").addEventListener("click", function(event)
	{
		var req = new XMLHttpRequest();
		var payload = {zipCity:null};
		payload.zipCity = document.getElementById("zip").value; //get zip code
		
		if(payload.zipCity.length > 0) //use zip code
		{
			req.open("GET", "http://api.openweathermap.org/data/2.5/weather?zip=" + payload.zipCity + ",us&appid=" + apiKey, true);
		}
		else //if zip code empty use city name
		{
			payload.zipCity = document.getElementById("city").value;
			req.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + payload.zipCity + ",us&appid=" + apiKey, true);
		}

		// Display the city weather, temperature, current weather, and humidity
		req.addEventListener("load",function()
		{
			if(req.status >= 200 && req.status < 400) //populate list with information if successful
			{
				var response = JSON.parse(req.responseText);
				console.log(response);
				document.getElementById("cityWeath").textContent = "City: " + response.name;
				document.getElementById("temp").textContent = "Temperature: " + response.main.temp;
				document.getElementById("currWeath").textContent = "Current Weather: " + response.weather[0].description;
				document.getElementById("humidity").textContent = "Humidity: " + response.main.humidity;
			} 
			else
				console.log("Error in network request: " + request.statusText);
		});
		req.send(JSON.stringify(payload)); //send GET request
		event.preventDefault();
	})
}

/*
 * Sends a POST request to httpbin.org/post. This request has a series of 3 key, value pairs.
 * parses the three key, value pairs from the server's response and displays them on the page
 */
function bindPostButton()
{
	document.getElementById("postSub").addEventListener("click", function(event)
	{
		var req = new XMLHttpRequest();
		var payload = {};
		
		//add values from form to payload
		payload[document.getElementById("key1").value] = document.getElementById("value1").value;
		payload[document.getElementById("key2").value] = document.getElementById("value2").value;
		payload[document.getElementById("key3").value] = document.getElementById("value3").value;
		
		req.open("POST", "http://httpbin.org/post", true);
		
		req.addEventListener("load", function()
		{
			if(req.status >= 200 && req.status < 400) //populate list with information
			{
				//get keys from response
				var response = JSON.parse(req.responseText);
				var keys = Object.keys(response.json);
				
				//populate list with key and value information parsed from server's response.
				document.getElementById("retKey1").textContent = "Key 1:" + keys[0];
				document.getElementById("retVal1").textContent = "Value 1:" + response.json[String(keys[0])];
				
				document.getElementById("retKey2").textContent = "Key 2: " + keys[1];
				document.getElementById("retVal2").textContent = "Value 2: " + response.json[String(keys[1])];
				
				document.getElementById("retKey3").textContent = "Key 3: " + keys[2];
				document.getElementById("retVal3").textContent = "Value 3: " + response.json[String(keys[2])];
			} 
			else
				console.log("Error in network request: " + request.statusText);
		});
		
		req.send(JSON.stringify(payload)); //send POST request
		event.preventDefault();
	})
}