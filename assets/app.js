// Initialize Firebase
var config = {
    apiKey: "AIzaSyATwNJnh4mzkjGuqPZ61NLbYGHkeuwy4ds",
    authDomain: "train-scheduler-ab87c.firebaseapp.com",
    databaseURL: "https://train-scheduler-ab87c.firebaseio.com",
    projectId: "train-scheduler-ab87c",
    storageBucket: "train-scheduler-ab87c.appspot.com",
    messagingSenderId: "1062891394469"
};
firebase.initializeApp(config);
// Make variable for 'Train' node
var db = firebase.database().ref('/Trains');



// jQuery Selectors
let name = $("#name");
let destination = $("#destination");
let time = $("#time");
let frequency = $("#frequency");

$("form").on("submit", function (e) {
    // Prevent page reload
    e.preventDefault();

    // collect values 
    let dbName = name.val().trim();
    let dbDestination = destination.val().trim();
    let dbTime = time.val().trim();
    let dbFrequency = frequency.val().trim();

    // Empty input fields in browser
    name.val("");
    destination.val("");
    time.val("");
    frequency.val(""); 

    // Push new Train object to firebase db
    db.push({
        name: dbName,
        destination: dbDestination,
        time: dbTime,
        frequency: dbFrequency
    });
})

// s = snapshot
db.on("child_added", function(childSnapshot) {

    var tName = childSnapshot.val().name;
    var tDestination =  childSnapshot.val().destination;
    var tFirst = childSnapshot.val().time;
    var tFrequency = parseInt(childSnapshot.val().frequency);
 


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(tFirst, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    
    // Minutes Until Train Arrives
    var mAway = tFrequency - tRemainder;
    console.log("MINUTES AWAY: " + mAway);

    // Next Train Time
    var tNext = moment().add(mAway, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(tNext).format("hh:mm"));

    $(".table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
    tFrequency + "</td><td>" + tNext + "</td><td>" + mAway + "</td></tr>");
  });



