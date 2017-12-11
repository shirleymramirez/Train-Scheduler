$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB9gNk63qxHlXhsnRWyw6ZoBlkT_DER4Bc",
        authDomain: "trainscheduler-a4ab4.firebaseapp.com",
        databaseURL: "https://trainscheduler-a4ab4.firebaseio.com",
        projectId: "trainscheduler-a4ab4",
        storageBucket: "trainscheduler-a4ab4.appspot.com",
        messagingSenderId: "1039027669333"
    };
    firebase.initializeApp(config);

    //------------------ Current Time Update on HTML page --------------------
    setInterval(function() {
        $("#currentTime").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);


    //------------------ Variable Declaration ----------------------------------
    var database = firebase.database();
    console.log("Database: " + database);

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var trainIDs = [];

    //------------------ capture submit button click ------------------------------
    $("#submitInfoBtn").on("click", function() {

        event.preventDefault();

        // storing and retrieving the most recent user.
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstTrainTime = $("#firstTrainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();

        console.log("TrainName: " + trainName);
        console.log("Destination: " + destination);
        console.log("FirstTrainTime: " + firstTrainTime);
        console.log("Frequency: " + frequency);

        // store initial data to Firebase database.
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("input").val("");
        return false;
    });

    //------------------ firebase watcher on value event ------------------------------
    database.ref().on("child_added", function(childSnapshot) {

            //log everything that's coming out of childSnapshot data
            var firstTrainTime = childSnapshot.val().firstTrainTime;
            var frequency = parseInt(childSnapshot.val().frequency);
            var firstTimeConverted = moment(firstTrainTime, "HH:mm");

            // get the difference in time from first time train arrival
            var diffTime = moment().diff(moment(firstTimeConverted));
            // diff time in minutes
            var diffTimeInMinutes = moment().diff(moment(firstTimeConverted), "minutes");

            // get the time Remainder from diff in times and frequency
            var timeRemainder = diffTimeInMinutes % frequency;

            // calculate minutes away based from frequency and time remainder
            var minutesAway = frequency - timeRemainder;

            // check next arrival and nextTrain
            var nextArrival;
            if (diffTimeInMinutes > 0) {
                var nextTrain = moment(firstTimeConverted + diffTime).add(minutesAway, "minutes");
                nextArrival = moment(nextTrain).format("HH:mm A");
            } else {
                minutesAway = Math.abs(diffTimeInMinutes);
                nextArrival = moment(firstTimeConverted).format("HH:mm A");
            }

            // update HTML train table with new trainName, destination, frequency, nextArrival and minutesAway
            $("#trainTable").append("<tr><td>" + childSnapshot.val().trainName + "</td>" +
                "<td>" + childSnapshot.val().destination + "</td>" +
                "<td>" + "Every " + frequency + " min" + "</td>" +
                "<td>" + nextArrival + "</td>" +
                "<td>" + minutesAway + " minutes away" + "</td></tr>");
            // Handle the errors
        },
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );
    // -------------------------------------------------------------------------------------------
});