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
                "Hypothesis": true,
                "Procedure": false,
                "Observations": false,
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

function parseStringIntoDate(str){
    return date = str.split("/");
}

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

function showCreateEventForm(){
    document.getElementById("create-event-form").style.display = "";
    document.getElementById("submit-event").style.display = "";
}

function addEvent(){
    let name = document.getElementById("event-name").value;
    let date = document.getElementById("datepicker").value;
    let goals = "{\"" + (document.getElementById("create-event-goals").value).replace(/\n/g, "\":false, \"") + "\":false}";
    document.getElementById("event-name").value = "";
    document.getElementById("datepicker").value = "";
    document.getElementById("create-event-goals").value = "";
    document.getElementById("create-event-form").style.display = "none";
    document.getElementById("submit-event").style.display = "none";
    if (name == "" || date == "" || goals == ""){
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