document.addEventListener('DOMContentLoaded', initPage);

//calls refreshTable and adds event listener to form to add new workout
function initPage()
{
	refreshTable(); //update table with contents of DB

	//add new row to table on click
	document.getElementById("addExercise").addEventListener("click", function(event)
	{
		console.log("Button Pressed");

		//AJAX call to /addRow
		var req = new XMLHttpRequest();
		var payload = {
			"name" : document.getElementById("exercise").value,
			"reps" : document.getElementById("reps").value,
			"weight" : document.getElementById("weight").value,
			"date" : document.getElementById("date").value,
			"lbs" : document.getElementById("lbs").value,
		}

		req.open("POST", '/addRow', true);
		
		req.setRequestHeader("Content-Type", "application/json");
		req.addEventListener("load", function()
		{
			if(req.status >= 200 && req.status < 400)
			{
				var response = JSON.parse(req.responseText);
				console.log("response");
				refreshTable(); //update table with contents of DB if request succeeds
			}
			else
			{
				console.log("Error connecting: " + req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();
	});

}

//remove row from database
function delRow()
{
	console.log(this.id);

	var payload = {"id" : this.id};

	var req = new XMLHttpRequest();
	req.open("POST", "/delRow", true);
	
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function()
	{
		if(req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			refreshTable();
		}
		else
		{
			console.log("Error connecting: " + req.statusText);
		}
	});

	req.send(JSON.stringify(payload));
	event.preventDefault();

}

//update row in table
function editWorkout()
{
	var payload = {
		"id" : this.id,
		"name" : document.getElementById("Eexercise").value,
		"reps" : document.getElementById("Ereps").value,
		"weight" : document.getElementById("Eweight").value,
		"date" : document.getElementById("Edate").value,
		"lbs" : document.getElementById("Elbs").value,
	};

	var req = new XMLHttpRequest();
	req.open("POST", '/editRow', true);
		
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function()
	{
		if(req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log("response");
			if(document.getElementById("editForm"))	//delete edit form
			{
				var form = document.getElementById("editForm");
				form.parentNode.removeChild(form);
			}
			refreshTable();
		}
		else
		{
			console.log("Error connecting: " + req.statusText);
		}
	});
	req.send(JSON.stringify(payload));
	event.preventDefault();
}

//calls database and creates table from returned rows
function refreshTable()
{
	var tbl = document.getElementById("tbl");
	while(tbl.lastChild && tbl.lastChild.id != "tblhead"){
		tbl.removeChild(tbl.lastChild);
	}

	var req = new XMLHttpRequest();

	req.open("GET", '/tblData', true);
	
	req.setRequestHeader("Content-Type", "application/json");
	req.addEventListener("load", function()
	{
		if(req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			for(var i = 0; i < response.length; ++i)	//add each returned row to table
			{
				addRow(response[i]);
			}
		}
		else
		{
			console.log("Error connecting: " + req.statusText);
		}
	});
	req.send();
}

//add edit form to page
function editRow()
{
	if(document.getElementById("editForm"))
	{
		var form = document.getElementById("editForm");
		form.parentNode.removeChild(form);
	}

	event.preventDefault();


	var tbl = document.getElementById("tbl");
	var row = this.parentNode.parentNode.parentNode; //get the row to populate table fields with
	var data = row.firstChild;
	var editForm = document.createElement("form");
	editForm.id = "editForm";
	var field = document.createElement("fieldset");

	var content = document.createElement("legend");
	content.textContent = "Edit Workout";

	field.appendChild(content);


	//create exercise textbox
	content = document.createElement("label");
	content.textContent = "Exercise";
	
	input = document.createElement("input");
	input.type = "text";
	input.name = "exercise";
	input.id = "Eexercise";
	input.value = data.textContent;
	data = data.nextSibling;
	
	content.appendChild(input);
	field.appendChild(content);

	content = document.createElement("br");
	field.appendChild(content);


	//create reps textbox
	content = document.createElement("label");
	content.textContent = "Reps";
	
	input = document.createElement("input");
	input.type = "number";
	input.name = "reps";
	input.id = "Ereps";
	input.value = data.textContent;
	data = data.nextSibling;
	
	content.appendChild(input);
	field.appendChild(content);

	content = document.createElement("br");
	field.appendChild(content);

	
	//create weight textbox
	content = document.createElement("label");
	content.textContent = "Weight";
	
	input = document.createElement("input");
	input.type = "number";
	input.name = "weight";
	input.id = "Eweight";
	input.value = data.textContent;
	data = data.nextSibling;
	
	content.appendChild(input);
	field.appendChild(content);

	content = document.createElement("br");
	field.appendChild(content);


	//create date textbox
	content = document.createElement("label");
	content.textContent = "Date";
	
	input = document.createElement("input");
	input.type = "text";
	input.name = "date";
	input.id = "Edate";
	input.value = data.textContent;
	data = data.nextSibling;
	
	content.appendChild(input);
	field.appendChild(content);

	content = document.createElement("br");
	field.appendChild(content);


	//create lbs textbox
	content = document.createElement("label");
	content.textContent = "lbs(1) or kg(0)";
	
	input = document.createElement("input");
	input.type = "number";
	input.name = "lbs";
	input.id = "Elbs";
	input.value = data.textContent;
	data = data.nextSibling;
	
	content.appendChild(input);
	field.appendChild(content);

	content = document.createElement("br");
	field.appendChild(content);


	//create submit button
	content = document.createElement("label");
	content.textContent = "Exercise";
	
	input = document.createElement("input");
	input.type = "submit";
	input.name = "editWorkout";
	input.id = this.id;
	input.value = "Edit Workout";
	input.addEventListener("click", editWorkout);
	
	content.appendChild(input);
	field.appendChild(content);

	
	editForm.appendChild(field);

	//insert form before display table
	tbl.parentNode.parentNode.insertBefore(editForm, tbl.parentNode);
}

//add row to table with correct fields
function addRow(data)
{
	var tbl = document.getElementById("tbl");
	var row = document.createElement("tr");
	
	//add name
	var tbldata = document.createElement("td");
	tbldata.textContent = data.name;
	row.appendChild(tbldata);
	
	//add reps
	tbldata = document.createElement("td");
	tbldata.textContent = data.reps;
	row.appendChild(tbldata);
	
	//add weight
	tbldata = document.createElement("td");
	tbldata.textContent = data.weight;
	row.appendChild(tbldata);
	
	//add date
	tbldata = document.createElement("td");
	tbldata.textContent = data.date;
	row.appendChild(tbldata);
	
	//add lbs
	tbldata = document.createElement("td");
	tbldata.textContent = data.lbs;
	row.appendChild(tbldata);
	
	//add edit form to table
	tbldata = document.createElement("td");
	var form = document.createElement("FORM");
	form.name = "Edit";
	form.method = "POST";
	form.action = "/editRow";
	
	var button = document.createElement("input")
	button.type = "submit";
	button.name = "edit";
	button.value = "Edit";
	button.id = data.id;
	button.addEventListener("click", editRow);
	
	form.appendChild(button);
	tbldata.appendChild(form);
	row.appendChild(tbldata);
	
	
	//add delete form to table
	tbldata = document.createElement("td");
	var form = document.createElement("FORM");
	form.name = "Delete";
	form.method = "POST";
	form.action = "/delRow";
	
	var button = document.createElement("input")
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
