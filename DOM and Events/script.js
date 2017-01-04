/*
 * A simple app to demonstrate event handling on button presses and
 * navigating the DOM. Allows a user to highlight cells in a table and
 * navigate through the table using buttons.
 */

var row = 0;
var column = 0;
createPage();

//Add thicker border to currently highlighted cell.
function HLCell()
{
	var toUpdate = document.getElementsByTagName("td");
	toUpdate[row * 4 + column].style.border = "4px solid black";
}

//remove border from current cell
function removeHL()
{
	var toUpdate = document.getElementsByTagName("td");
	toUpdate[row * 4 + column].style.border = "2px solid black";
}

//set background of cell to yellow
function markCell()
{
	var toUpdate = document.getElementsByTagName("td");
	toUpdate[row * 4 + column].style.backgroundColor = "yellow";
}

//highlight cell above currently highlighted cell (if cells above)
function tblUp()
{
	if(row > 0)
	{
		removeHL();
		--row;
		HLCell();
	}
}

//highlight cell below currently highlighted cell (if cells below)
function tblDown()
{
	if(row < 2)
	{
		removeHL();
		++row;
		HLCell();
	}
}

//highlight cell left of currently highlighted cell (if cells to left)
function tblLeft()
{
	if(column > 0)
	{
		removeHL();
		--column;
		HLCell();
	}
}

//highlight cell right of currently highlighted cell (if cells to right)
function tblRight()
{
	if(column < 3)
	{
		removeHL();
		++column;
		HLCell();
	}
}

//create a 4x4 table
function createTable()
{
	//create the table
	var table = document.createElement("table");

	table.appendChild(document.createElement("tbody"));
	table = table.firstElementChild; //tbody
	for(var i = 0; i < 4; ++i) //add rows to table
	{
		table.appendChild(document.createElement("tr"));
	}
	table = table.firstElementChild; //tr

	for(var i = 0; i < 4; ++i)
	{
		var header = document.createElement("th");
		header.textContent = "Header " + (i + 1);
		table.appendChild(header);
	}
	for(var i = 1; i < 4; ++ i) //cycle through rows
	{
		table = table.nextElementSibling; //next row
		for(var j = 1; j < 5; ++j)  //cycle through columns
		{
			var cell = document.createElement("td");
			cell.textContent = j + ", " + i;
			cell.style.border = "2px solid black";
			table.appendChild(cell);
		}
	}

	table = table.parentNode; //tbody
	table = table.parentNode; //table
	document.body.appendChild(table);
}

//create a button with passed label and set EventListener to passed function
function createButton(label, func)
{
	var button = document.createElement("button");
	button.textContent = label;
	button.addEventListener("click", func);
	document.body.appendChild(button);
}

//create a 4x4 table and 4 buttons
function createPage()
{	
	createTable(); //create tables
	
	//create the buttons
	createButton("up", tblUp);
	createButton("down", tblDown);
	createButton("left", tblLeft);
	createButton("right", tblRight);
	createButton("Mark Cell", markCell);
	
	HLCell(); //highlight currently selected cell
}