var events = {
    events:[
        {
            "name": "English Essay",
            "dueYear": 2019,
            "dueMonth": 12,
            "dueDay": 10,
            "subEvents": {
                "Body Paragraph 2": true,
                "Body Paragraph 3": false,
                "Conclusion Paragraph": false
            }
        },
        {
            "name": "Chemistry Lab Report",
            "dueYear": 2020,
            "dueMonth": 1,
            "dueDay": 8,
            "subEvents": {
                "Hypothesis": true,
                "Procedure": true,
                "Observations": true,
                "Analysis": false
            }
        }
    ]
}


// Sort events alphabetically
events.events.sort(
    function(a, b){
        return a.name.localeCompare(b.name);
    }
)

// Convert given date integers into formatted date
function parseDate(day, month, year){
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month-1] + " " + day + ", " + year;
}

// Parses date into string
function parseStringIntoDate(str){
    return date = str.split("/");
}

// Sorts cards by date, toggling through ascending and descending order every other sort
var reverseDate = false;
function sortEventsByDay(){
    if (!reverseDate){
        events.events.sort(
            function(a, b){
                let aYear = a.dueYear * 100000 + a.dueMonth*1000 + a.dueDay;
                let bYear = b.dueYear * 100000 + b.dueMonth*1000 + b.dueDay;
                return aYear - bYear;
            }
        )
        reverseDate = !reverseDate;
    }
    else {
        events.events.sort(
            function(a, b){
                let aYear = a.dueYear * 100000 + a.dueMonth*1000 + a.dueDay;
                let bYear = b.dueYear * 100000 + b.dueMonth*1000 + b.dueDay;
                return bYear - aYear;
            }
        )
        reverseDate = !reverseDate;
    }
    writeCards();
}

// Sort cards by completion rate, toggling throuhg ascending and descending order every other sort
var reverseCompletion = false;
function sortByCompletion(){
    if (!reverseCompletion){
        events.events.sort(
            function(a, b){
                return finishedPercentFromObject(a) - finishedPercentFromObject(b);
            }
        )
        reverseCompletion = !reverseCompletion;
    }
    else {
        events.events.sort(
            function(a, b){
                return finishedPercentFromObject(b) - finishedPercentFromObject(a);
            }
        )
        reverseCompletion = !reverseCompletion;
    }
    writeCards();
}

// Get the completion percentage from a JSON Object and returns it as an float
function finishedPercentFromObject(obj){
    let subEventCount = 0;
    let finishedSubEventCount = 0;
    for (var j in obj.subEvents){
        subEventCount++;
        if (obj.subEvents[j]){
            finishedSubEventCount++;
        }
    }
    return (finishedSubEventCount/subEventCount) * 100;
}

// Show the create event form
function showCreateEventForm(){
    document.getElementById("create-event-form").style.display = "";
    document.getElementById("submit-event").style.display = "";
    document.getElementById("cancel-submit").style.display = "";
}

// Cancel current submission and clear values in input fields
function cancelSubmit(){
    document.getElementById("event-name").value = "";
    document.getElementById("datepicker").value = "";
    document.getElementById("create-event-goals").value = "";
    document.getElementById("create-event-form").style.display = "none";
    document.getElementById("submit-event").style.display = "none";
    document.getElementById("cancel-submit").style.display = "none";
}

// Adds a new events JSON Object into the events array
function addEvent(){
    let name = document.getElementById("event-name").value;
    let date = document.getElementById("datepicker").value;
    // Convert text into JSON object of all false values
    let goals = "{\"" + (document.getElementById("create-event-goals").value).replace(/\n/g, "\":false, \"") + "\":false}";
    document.getElementById("event-name").value = "";
    document.getElementById("datepicker").value = "";
    document.getElementById("create-event-goals").value = "";
    document.getElementById("create-event-form").style.display = "none";
    document.getElementById("submit-event").style.display = "none";
    document.getElementById("cancel-submit").style.display = "none";
    // If any text field is empty, abort
    if (name === "" || date === "" || goals === ""){
        document.getElementById("snackbar-fail").className = "show";
        setTimeout(function(){ document.getElementById("snackbar-fail").className = document.getElementById("snackbar-fail").className.replace("show", ""); }, 3000);
        return;
    }
    events.events.push(
        {
            "name": name,
            "dueYear": parseInt(parseStringIntoDate(date)[2]),
            "dueMonth": parseInt(parseStringIntoDate(date)[0]),
            "dueDay": parseInt(parseStringIntoDate(date)[1]),
            "subEvents": JSON.parse(goals)
        }
    )
    document.getElementById("snackbar-success").className = "show";
    setTimeout(function(){ document.getElementById("snackbar-success").className = document.getElementById("snackbar-success").className.replace("show", ""); }, 3000);
    writeCards();
}

function addSubEvent(id){
    console.log("success");
    let txt = document.getElementById(id.replace(/-/g, " ") + "-sub-event-input").value;
    if (txt == ""){
        return;
    }
    for (let i = 0; i < events.events.length; i++){
        if (events.events[i].name == id.replace(/-/g, " ")){
            events.events[i].subEvents[txt] = false;
            break;
        }
    }
    txt.value = "";
    writeCards();
}

function removeSubEvent(eventId, subEventId){
    // console.log("success");
    for (let i = 0; i < events.events.length; i++){
        if (events.events[i].name == eventId.replace(/-/g, " ")){
            console.log("success");
            for (let j in events.events[i].subEvents){
                if (j == subEventId.replace(/-/g, " ")){
                    delete events.events[i].subEvents[subEventId.replace(/-/g, " ")];
                    break;
                }
            }
        }
    }
    writeCards();
}

// Remove a JSON Object with a certain id
function removeEvent(id){
    for (let i = 0; i < events.events.length; i++){
        if (events.events[i].name == id){
            events.events.splice(i, 1);
            break;
        }
    }
    writeCards();
}

// Write cards into DOM
function writeCards(){
    var eventsContainer = document.getElementById("cardsContainer");
    eventsContainer.innerHTML = "";
    for (var i = 0; i < events.events.length; i++){
        eventsContainer.innerHTML += "<div class=\"eventCards\"><div class=\"cardInfo\">" +
        "<h1>" +
        events.events[i].name +  
        "</h1>" +
        "<h2 class=\"\">" +
        parseDate(events.events[i].dueDay,events.events[i].dueMonth, events.events[i].dueYear) +
        "</h2>" +
        "<div class=\"subEvents\">" +
        writeSubEvents(i) +
        "</div>" +
        "</div>" +
        "<div class=\"completePercent\" \>" +
        finishedPercent(i) + 
        " %" +
        "<br><button class=\"delete-card\" id=\"" + 
        events.events[i].name + 
        "\" onClick=removeEvent(this.id)>" +
        "Delete" + 
        "</button>" +
        "<br><button class=\"addSubEvent\" onClick=addSubEvent(\""+events.events[i].name.replace(/ /g, "-") + "\")> Add Goal" +
        "</button>" +
        "<br><input type=\"text\" placeholder=\"Goal\" class=\"subtaskName\" id=\"" +
        events.events[i].name + 
        "-sub-event-input\">"+
        "</div>" +
        "</div>";
    }
}

// Writes sub events into DOM
function writeSubEvents(i){
    let outputString = "<ul>";
    for (var j in events.events[i].subEvents){
        // Due to JS inserting quotes at the first whitespace of onclick functions, temporary
        // dashes have to be used in order to construct elements with functions
        let cardID = events.events[i].name.replace(/ /g, "-");

        // Sub event has been completed
        if (events.events[i].subEvents[j]){
            outputString += "<li class=\"completed\"> <button class=\"remove-sub-event\" onClick=removeSubEvent(\"" + cardID + "\",\"" + j.replace(/ /g, "-") + "\")>X</button><input class=\"checkbox\" onClick=updateFinishedPercent(\"" + cardID + "\") type=\"checkbox\" id=\"" + j + "\"checked/>" + "<span class=\"checkbox-custom\"></span>" + j + "</li>";
        }
        // Sub event has not been completed
        else {
            outputString += "<li class=\"incomplete\"> <button class=\"remove-sub-event\" onClick=removeSubEvent(\"" + cardID + "\",\"" + j.replace(/ /g, "-") + "\")>X</button><input onClick=updateFinishedPercent(\"" + cardID + "\") type=\"checkbox\" id=\"" + j + "\"/>" + "<span class=\"checkbox-custom\"></span>" + j + "</li>";
        }
    }
    return outputString + "</ul>";
}

// Gets the completion percentage of a JSON Object and returns it as a colored span element
function finishedPercent(i){
    let subEventCount = 0;
    let finishedSubEventCount = 0;
    
    // Iterate through sub events of given task
    for (let j in events.events[i].subEvents){
        subEventCount++;

        // Sub event has value of true
        if (events.events[i].subEvents[j]){
            finishedSubEventCount++;
        }
    }
    // Color code based on completion
    if (finishedSubEventCount/subEventCount <= 0.25){
        return "<span class=\"not-complete\" id=\"" + events.events[i].name + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
    else if (finishedSubEventCount/subEventCount <= 0.5){
        return "<span class=\"halfway\" id=\"" + events.events[i].name + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
    else if (finishedSubEventCount/subEventCount <= 0.75){
        return "<span class=\"almost-complete\" id=\"" + events.events[i].name + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
    return "<span class=\"complete\" id=\"" + events.events[i].name + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
}


// Updates the completion percentage based on checkboxes filled in
function updateFinishedPercent(id){
    let subEventCount = 0;
    let finishedSubEventCount = 0;

    // Iterate through events to find correct task
    for (let j = 0; j < events.events.length; j++){

        // Because the parameters of this function was previously replaced with 
        // Placeholders, this converts them back for comparison against
        // Every created task, using linear search to check if they match
        if (events.events[j].name == id.replace(/-/g, " ")){

            // Iterate through subtasks and recount the completion percentage
            for (let i in events.events[j].subEvents){
                subEventCount++;
                if (document.getElementById(i).checked){
                    finishedSubEventCount++;
                    // Modify completion boolean in JSON object so
                    // changes aren't overwritten when calling
                    // writeCards() again
                    events.events[j].subEvents[i] = true;
                }
                else {
                    // Modify completion boolean in JSON object so
                    // sube events are not permanently true
                    events.events[j].subEvents[i] = false;
                }
            }
            // Break upon finding the targeted task
            break;
        }
        
    }
    // Color coded based on completion
    if (finishedSubEventCount/subEventCount <= 0.25){
        document.getElementById(id.replace(/-/g, " ")).innerHTML = "<span class=\"not-complete\" id=\"" + id.replace(/-/g, " ") + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
    else if (finishedSubEventCount/subEventCount <= 0.5){
        document.getElementById(id.replace(/-/g, " ")).innerHTML = "<span class=\"halfway\" id=\"" + id.replace(/-/g, " ") + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
    else if (finishedSubEventCount/subEventCount <= 0.75){
        document.getElementById(id.replace(/-/g, " ")).innerHTML = "<span class=\"almost-complete\" id=\"" + id.replace(/-/g, " ") + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
    else {
        document.getElementById(id.replace(/-/g, " ")).innerHTML = "<span class=\"complete\" id=\"" + id.replace(/-/g, " ") + "\">" + ((finishedSubEventCount/subEventCount) * 100).toFixed(2) + "</span>";
    }
}

// Initially hide submit form
document.getElementById("create-event-form").style.display = "none";
document.getElementById("submit-event").style.display = "none";
document.getElementById("cancel-submit").style.display = "none";
writeCards();
writeSubEvents(0);