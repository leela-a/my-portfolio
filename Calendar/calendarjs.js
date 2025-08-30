var date = new Date();
var current_month = date.getMonth();
var current_year = date.getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const events = [];

var first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); //get first day of first week
var first_day = new Date(date.getFullYear(), date.getMonth(), 1).getDate(); //get first day
var last_day_of_month = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); //get last day of month
var last_day_of_month_day = new Date(date.getFullYear(), date.getMonth(), last_day_of_month).getDay(); //get day (mon, tues, etc.) of last of month

class Storage {
	addEventsToArray() {
		let events_in_storage = localStorage.getItem("events_storage");
		let events_parsed = JSON.parse(events_in_storage);
		
		if (events_parsed) {
			for (let i = 0; i < events_parsed.length; i++) { //add events in storage to array "events"
				events.push(events_parsed[i]);
			}
		}
	}
	
	addEventsToCalendar(cells, i, j) {
		if (events[j]) {
			let event = events[j];
			let year = event.substring(0,4); //get year
			let month = event.substring(4, 6); //get month
			let day = event.substring(6, 9); //get date

			if (year == current_year && month == current_month) {
				if (Number(cells[i].innerHTML) == Number(day)) { //both test and day are strings and i cant seem to compare them so i convert them to numbers to compare
					cells[i].id = 'booked';
					cells[i].innerHTML += event.substring(9);
				}
			}
		}	
	}
	
	storeEvent() {
		localStorage.setItem("events_storage", JSON.stringify(events)); //add event to localstorage
	}
	
	removeEvent(d) {
		localStorage.setItem("events_storage", JSON.stringify(d));
	}
}

class Calendar {
	
	createCalendar() {
		let tempcal = new Calendar();
		let tempstore = new Storage();
		
		let calendar = '<table id="calendar"><th style = "text-align: center" colspan = 7 id="monthDisplay"></th><tr><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr><tr>';

		for (let i = 0; i < first_day_of_month; i++) {//create empty cells for days not in month 
			calendar += '<td></td>'; 
		}

		for (let i = 1; i <= last_day_of_month; i++) {
			calendar += '<td>' + i + '</td>'; //create cell for each day

			if (first_day_of_month % 7 == 6) { //if end of week, create new row
				calendar += '</tr><tr>';
			}
			
			first_day_of_month++; //get day of next date (mon, tues, etc.)
		}

		if (last_day_of_month_day != 0) { //if last day doesnt end on a saturday, fill table with empty cells until saturday is reached
			for (let i = last_day_of_month_day; i < 6; i++) {
			  calendar += '<td></td>';
			}
		}
		
		calendar += '</tr></table>'; //close table
		const bodyid = document.getElementById("displaycalendar"); //get id of div
		bodyid.innerHTML = calendar; //overwrite everything in div
		document.getElementById("monthDisplay").innerHTML = months[current_month] + " " + current_year; //display month on table header	

		let table = document.getElementById('calendar'); //get table id
		let cells = table.getElementsByTagName("td"); //get all table cells
		let empty_cells = 0;
			
		for (let i = 0; i < cells.length; i++) { //go through each cell
			if (cells[i].innerHTML == "" && i < first_day_of_month) { //get number of cells with no dates per month
				empty_cells++;
			}

			for (let j = 0; j <= events.length; j++) { //add events in array back to new calendar instance
				tempstore.addEventsToCalendar(cells, i, j);
			}	
			
			cells[i].onclick = function() { //prompt user when a cell is clicked
				if (cells[i].innerHTML == '') { //if clicked cell is empty
					alert("Date empty");
				}

				else if (cells[i].id == 'booked') { //if cell id has "booked"
					const dialogbox = document.getElementById('confirmOrDelete');
					const deleteButton = document.getElementById('delete');
					const cancelButton = document.getElementById('cancel')

					confirmOrDelete.showModal() //custom dialog box to delete events

					cancelButton.onclick = function() { //cancel button
						dialogbox.close(); //close dialog box
					}

					deleteButton.onclick = function() { //delete event from array
						
						tempcal.deleteEvent(dialogbox, cells, i, empty_cells);
					}
				}

				else { //add event to array
					tempcal.addEvent(cells, i);
				}
			}
		}
	}
	
	addEvent(cells, i) {
		let tempstore = new Storage();
		let reason = prompt("What would you like to note for this date?");
		if (reason) { //if reason is not empty
					  //array format is yyyymm dd event
					  //because month and day can be 1 or 2 digits, to keep format consistent:				
		if (current_month >= 10 && cells[i].innerHTML >= 10) {
			events.push(current_year + "" + current_month + " " + cells[i].innerHTML + " <br></br>" + reason)
		}

		else if (current_month < 10 && cells[i].innerHTML < 10) {
			events.push(current_year + "" + current_month + " " + cells[i].innerHTML + "   <br></br>" + reason)
		}

		else {
			events.push(current_year + "" + current_month + " " + cells[i].innerHTML + "  <br></br>" + reason)
		}

		cells[i].id = "booked"; //give id to booked cells
		cells[i].innerHTML += "<br></br>" + reason; //add event to date
		tempstore.storeEvent();
		}
	}
	
	deleteEvent(dialogbox, cells, i, empty_cells) {
		let tempstore = new Storage();
		for (let k = 0; k < events.length; k++) { //go through each event in array
			let event = events[k];
			let year = event.substring(0, 4); //get year
			let month = event.substring(4, 6); //get month
			let day = event.substring(6, 9); //get date

			if (year == current_year && month == current_month) { //if year and month matches date in array
				let date_of_cell = (cells[i].innerHTML).substring(0, 2); //get day event is stored in
				if (Number(date_of_cell) == Number(day)) { //both date_of_cell and day are strings and i cant seem to compare them so i convert them to numbers to compare
					events.splice(k, 1); //delete event from array
					let d = JSON.parse(localStorage.getItem("events_storage")); //to remove item from localStorage, need to convert it to string
					d.splice(k, 1); //then splice it
					tempstore.removeEvent(d);
				}
			}
		}
		cells[i].removeAttribute('id'); //remove id
		cells[i].innerHTML = i - empty_cells + 1; //reset date
		dialogbox.close(); //close dialog box
	}
}

class Buttons {
	
	monthIncrease() {
		current_month++;

		if (current_month > 11) { //loop back to 0 if it goes over 11
			current_month = 0;
			current_year++;
		}

		first_day_of_month = new Date(current_year, current_month, 1).getDay(); //get new first day of first week
		last_day_of_month = new Date(current_year, current_month + 1, 0).getDate(); //get new last day of month
		first_day = new Date(current_year, current_month, 1).getDate(); //get new first day
		last_day_of_month_day = new Date(current_year, current_month, last_day_of_month).getDay(); //get new day (mon, tues, etc.) of last of month
		cal.createCalendar();
	}
	
	monthDecrease() {
		current_month--; 

		if (current_month < 0) { //loop forward to 11 if it goes below 0
			current_month = 11;
			current_year--;
		}

		first_day_of_month = new Date(current_year, current_month, 1).getDay(); //get new first day of first week
		first_day = new Date(current_year, current_month, 1).getDate(); //get new first day
		last_day_of_month = new Date(current_year, current_month + 1, 0).getDate(); //get new last day of month
		last_day_of_month_day = new Date(current_year, current_month, last_day_of_month).getDay(); //get new day (mon, tues, etc.) of last of month
		cal.createCalendar();
	}
}

var stor = new Storage();
stor.addEventsToArray();

var cal = new Calendar();

cal.createCalendar();

var new_button = new Buttons();