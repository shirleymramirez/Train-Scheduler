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

    var database = firebase.database();
    console.log(database);

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var minutesAway = "";

    // capture submit button click
    $("#submitInfo").on("click", function() {

        event.preventDefault();

        // storing and retrieving the most recent user.
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstTrainTime = $("#firstTrainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();
        minutesAway = $("#minutesAwayDisplay").val().trim();

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);
        console.log(minutesAway);

        // store initial data to Firebase database.
        //(or.set())
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            minutesAway: minutesAway,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("input").val("");
        return false;
    });

    // firebase watcher on value event
    database.ref().on("child_added", function(childSnapshot) {
            //log everything that's coming out of snapshot
            var trainName = childSnapshot.val().trainName;
            var destination = childSnapshot.val().destination;
            var firstTrainTime = childSnapshot.val().firstTrainTime;
            var frequency = childSnapshot.val().frequency;
            var minutesAway = childSnapshot.val().minutesAway;

            var frequency = parseInt(frequency);
            console.log(frequency);

            // Change the HTML to reflect
            $("#trainTable").append(
                "<tr><td id='trainNameDisplay'>" + trainName +
                "</td><td id='destinationDisplay'>" + destination +
                "</td><td id='frequencyminDisplay'>" + frequency + "</td></tr>");

            // Handle the errors
        },
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );
});