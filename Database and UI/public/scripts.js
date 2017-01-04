document.addEventListener('DOMContentLoaded', initPage);

/*
 * Initialize the workout form and workout table.
 */
function initPage()
{
	var req = new XMLHttpRequest();

	req.open("GET", '/', true);
	
	req.setRequestHeader("Content-Type", "application/json");
	//try to get all workouts from the database
	req.addEventListener("load", function()
	{
		if(request.status >= 200 && req.status < 400)
		{
			var response = req.responseText;
			addRow(response);
		}
		else
		{
			console.log("Error connecting: " + req.statusText);
		}
		
		console.log(JSON.stringify(payload));
		req.send(payload);
	});

	//adds a new workout to the table and adds it to the database when addExercise pressed
	document.getElementById("addExercise").addEventListener("click", function(event)
	{
		var req = new XMLHttpRequest();
		var payload = {
			"name" : document.getElementById("exercise").value,
			"reps" : document.getElementById("reps").value,
			"weight" : document.getElementById("reps").value,
			"date" : document.getElementById("date").value,
			"lbs" : document.getElementById("lbs").value,
		}

		req.open("POST", '/', true);
		
		//try to add new workout to database
		req.setRequestHeader("Content-Type", "application/json");
		req.addEventListener("load", function()
		{
			if(request.status >= 200 && req.status < 400)
			{
				var response = req.responseText;
				addRow(response);
			}
			else
			{
				console.log("Error connecting: " + req.statusText);
			}
			
			console.log(JSON.stringify(payload));
			req.send(payload);
		});
	});
}

/*
 * Add a new row to the workout database
 */
function addRow(data)
{
	var tbl = document.getElementById("tbl");
	var row = document.createElement("tr");
	
	var tbldata = document.createElement("td");
	tbldata.textContent = data.name;
	row.appendChild(tbldata);
	
	tbldata = document.createElement("td");
	tbldata.textContent = data.reps;
	row.appendChild(tbldata);
	
	tbldata = document.createElement("td");
	tbldata.textContent = data.weight;
	row.appendChild(tbldata);
	
	tbldata = document.createElement("td");
	tbldata.textContent = data.date;
	row.appendChild(tbldata);
	
	tbldata = document.createElement("td");
	tbldata.textContent = data.lbs;
	row.appendChild(tbldata);
	
	//add edit form to table so workout can be edited
	tbldata = document.createElement("td");
	var form = document.createElement("FORM");
	form.name = "Edit";
	form.method = "POST";
	form.action = "/";
	
	var button = document.createElement("BUTTON")
	button.type = "submit";
	button.name = "edit";
	button.value = "Edit";
	button.id = data.id;
	button.addEventListener("click", editRow);
	
	form.appendChild(button);
	tbldata.appendChild(form);
	row.appendChild(tbldata);
	
	
	//add delete form to table so workout can be deleted
	tbldata = document.createElement("td");
	var form = document.createElement("FORM");
	form.name = "Delete";
	form.method = "POST";
	form.action = "/";
	
	var button = document.createElement("BUTTON")
	button.type = "submit";
	button.name = "delete";
	button.value = "Delete";
	button.id = data.id;
	button.addEventListener("click", delRow);
	
	form.appendChild(button);
	tbldata.appendChild(form);
	row.appendChild(tbldata);
	
	tbl.appendChild(row);
}

/*
 * Delete the workout from the workouts database and remove it from the table
 */
function delRow()
{
	var delRow = this.parentNode.parentNode;
	var req = new XMLHttpRequest();
	var payload = {
		"type" = "del",
		"id" = this.id;
	}
	
	// Open POST request to database and attempt to delete it.
	req.open("POST", '/', true);
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function()
	{
		if(req.status >= 200 && req.status < 400)
		{
			var response = req.responseText;
			console.log(response);
			
			var tbl = document.getElementById("tbl");
			var numRows = tbl.rows.length;
			
			//check to make sure correct workout entry was deleted
			for(var i = 0; i < numRows; ++i) 
			{
				var row = tbl.rows[i];
				if(row == delRow)
				{
					table.deleteRow(i);
					--numRows;
					--i;
				}
			}
		}
		else
		{
			console.log("Error Connecting: " + req.statusText);
		}
		req.send(payload);
	});
}



