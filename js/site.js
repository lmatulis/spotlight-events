const events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017"
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018"
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019"
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017"
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018"
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019"
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017"
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018"
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019"
  },
];


//entry point to app
//loads data from local storage or 'const events' 
function buildDropDown() {
    //grab the dropdown we want to add city names to
    let eventDD = document.getElementById("eventDropDown");
    eventDD.innerHTML = "";

    //pull events from local storage if it exists.
    let currentEvents = JSON.parse(localStorage.getItem("eventData"));
    if (currentEvents == null) {
      currentEvents = events;
      localStorage.setItem("eventData" ,JSON.stringify(currentEvents));
    }

    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = "Stats for All Events"

    //need array of distinct city names
    //look up: spread, set, map
    //let distinctCities = [... new Set(currentEvents.map((event) => event.city)]
    let distinctCities = getDistinctCities(currentEvents);

    let menuItem = `<li><a class="dropdown-item" onclick="getEvents(this)" data-city="All">All</a></li>`;
    eventDD.innerHTML += menuItem;

    for(let index = 0; index < distinctCities.length; index++) {
        let menuItem = `<li><a class="dropdown-item" onclick="getEvents(this)" data-city="${distinctCities[index]}">${distinctCities[index]}</a></li>`;
        eventDD.innerHTML += menuItem;
    }

    displayStats(currentEvents);

    displayData(currentEvents);
}

function getDistinctCities(currentEvents) {

    let distinctCities = [];

    for(let index = 0; index < currentEvents.length; index++) {
        let eventObject = currentEvents[index];

        let city = eventObject.city;
        let notFound = distinctCities.find((dc) => dc == city);

        if(notFound == undefined) {

            distinctCities.push(city);

        }
    }
    return distinctCities;
}

//display stats for selected city
function displayStats(events) {
    let total = 0;
    let average = 0;
    let most = 0;
    let least = events[0].attendance;
    let currentAttendance = 0;

    //display the total attendance
    for(let index = 0; index < events.length; index++) {
        currentAttendance = events[index].attendance;
        total += currentAttendance;

        average = total / events.length;
        if(currentAttendance > most) { most = currentAttendance; }
        if(currentAttendance < least) { least = currentAttendance; }

    }
    document.getElementById("average").innerHTML = Math.round(average).toLocaleString();
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();
    document.getElementById("total").innerHTML = total.toLocaleString();
}

//get events for a given city
function getEvents(element) {
    let city = element.getAttribute("data-city");

    let filteredEvents = events;

    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = `Stats for ${city} Events`;

    let currentEvents = JSON.parse(localStorage.getItem("eventData")) || events;

    if(city == 'All'){
        filteredEvents = currentEvents;
    }else{
        filteredEvents = currentEvents.filter( function(item) {
            if(item.city == city) { return item; }
        });
    }

    displayStats(filteredEvents);
    displayData(filteredEvents);
}

//save a new event from the add data form
function saveEventData() {
  //grab the current events
  let currentEvents = JSON.parse(localStorage.getItem("eventData")) || events;

  let eventObj = {};

  eventObj["event"] = document.getElementById("newEventName").value;

  eventObj["city"] = document.getElementById("newEventCity").value;

  //the selected state from the select control
  let stateSel = document.getElementById("newEventState")
  eventObj["state"] = stateSel.options[stateSel.selectedIndex].text;

  eventObj["attendance"] = parseInt(document.getElementById("newEventAttendance").value);

  //grab the date from the form and format it by taking the time off.
  let eventDate = document.getElementById("newEventDate").value;
  let eventDate2 = `${eventDate} 00:00`
  eventObj["date"] = new Date(eventDate2).toLocaleDateString();

  //add to object array
  currentEvents.push(eventObj);

  //save to local storage
  localStorage.setItem("eventData", JSON.stringify(currentEvents));

  //refresh data on page
  buildDropDown();
}

//display a grid of event data
function displayData(events) {
  //grabbing html 
  let template = document.getElementById("eventData-template");
  let eventBody = document.getElementById("eventBody");

  //clear out data that is there
  eventBody.innerHTML = "";

  //loop over the events and display them
  for(let index = 0; index < events.length; index++) {
    let curEvent = events[index];

    //import a copy of table row from the template
    let eventRow = document.importNode(template.content, true);

    //select the td based on the attribute
    eventRow.querySelector("[data-event]").textContent = curEvent.event;
    eventRow.querySelector("[data-city]").textContent = curEvent.city;
    eventRow.querySelector("[data-state]").textContent = curEvent.state;
    eventRow.querySelector("[data-attendance]").textContent = curEvent.attendance;
    eventRow.querySelector("[data-date]").textContent = new Date(curEvent.date).toLocaleDateString();

    eventBody.appendChild(eventRow);
  }
}

buildDropDown();