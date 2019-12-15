var events = {
    events:[
        {
            "name": "English Essay",
            "dueYear": 2019,
            "dueMonth": 12,
            "dueDay": 10,
            "subEvents": {
                "Body Paragraph 2": false,
                "Body Paragraph 3": false,
                "Conclusion Paragraph": true
            }
        },
        {
            "name": "Chemistry Lab Report",
            "dueYear": 2020,
            "dueMonth": 1,
            "dueDay": 8,
            "subEvents": {
                "Body Paragraph 1": false,
                "Body Paragraph 3": false,
                "Conclusion Paragraph": false
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

function praseStringIntoDate(str){
    return date = str.split("/");
}

function sortEventsByDay(){
    events.events.sort(
        function(a, b){
            let aYear = a.dueYear * 10000 + a.dueMonth*100 + a.dueDay;
            let bYear = b.dueYear * 10000 + b.dueMonth*100 + b.dueDay;
            return aYear - bYear;
        }
    )
    writeCards();
}

function showCreateEventForm(){
    document.getElementById("create-event-form").style.display = "";
    document.getElementById("submit-event").style.display = "";
}

function addEvent(){
    console.log("success");
    let name = document.getElementById("event-name").value;
    let date = document.getElementById("datepicker").value;
    let goals = "{\"" + document.getElementById("create-event-goals").value.replace("\n", "\":false, \"") + "\":false}";
    console.log(goals);
    events.events.push(
        {
            "name": name,
            "dueYear": praseStringIntoDate(date)[2],
            "dueMonth": praseStringIntoDate(date)[0],
            "dueDay": praseStringIntoDate(date)[1],
            "subEvents": JSON.parse(goals)
        }
    )
    document.getElementById("create-event-form").style.display = "none";
    document.getElementById("submit-event").style.display = "none";
    writeCards();
}

// Write cards into html
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
        "<div class=\"completePercent\">" +
        finishedPercent(i).toFixed(2) + 
        " %" +
        "</div>" + 
        "</div>"
    }
}

function writeSubEvents(i){
    let outputString = "<ul>";
    for (var j in events.events[i].subEvents){
        if (events.events[i].subEvents[j]){
            outputString += "<li class=\"completed\">" + j + "</li>";
        }
        else {
            outputString += "<li class=\"incomplete\">" + j + "</li>";
        }
    }
    return outputString + "</ul>";
}

function finishedPercent(i){
    let subEventCount = 0;
    let finishedSubEventCount = 0;
    for (var j in events.events[i].subEvents){
        subEventCount++;
        if (events.events[i].subEvents[j]){
            finishedSubEventCount++;
        }
    }
    return (finishedSubEventCount/subEventCount) * 100;
}


document.getElementById("create-event-form").style.display = "none";
document.getElementById("submit-event").style.display = "none";
writeCards();
writeSubEvents(0);