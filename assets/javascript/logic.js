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
    console.log("Database: " + database);

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";

    // capture submit button click
    $("#submitInfo").on("click", function() {

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

    // firebase watcher on value event
    database.ref().on("child_added", function(childSnapshot) {

            //log everything that's coming out of snapshot
            var trainName = childSnapshot.val().trainName;
            var destination = childSnapshot.val().destination;
            var firstTrainTime = childSnapshot.val().firstTrainTime;
            var frequency = parseInt(childSnapshot.val().frequency);
            console.log("Frequency: " + frequency);

            //get current time in military format
            var currentTime = moment();
            // var currentTime = moment().format("MMMM DD YYYY, h:mm:ss a");
            console.log("CURRENT TIME: " + moment().format("HH:mm"));

            //Change HTML Elements to show current time
            $("#currentTime").text(currentTime);

            //First Time Converted, subtract 1 year to make sure it is the current time
            // var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
            var firstTimeConverted = moment(firstTrainTime, "HH:mm").diff(1, "years");
            console.log("DATE CONVERTED: " + firstTimeConverted);

            // get the converted time from the first train time and store in a variable
            var trainTime = moment(firstTimeConverted).format("HH:mm");
            console.log("TRAIN TIME : " + trainTime);

            //DIFFERENCE B/T THE TIMES 
            // var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
            var timeConverted = moment(trainTime, "HH:mm").diff(1, "years");
            var timeDifference = moment().diff(moment(timeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + timeDifference);

            //REMAINDER 
            var timeRemainder = timeDifference % frequency;
            console.log("TIME REMAINING: " + timeRemainder);

            //MINUTES UNTIL NEXT TRAIN
            var minutesAway = frequency - timeRemainder;
            console.log("MINUTES UNTIL NEXT TRAIN: " + minutesAway);

            //NEXT TRAIN
            var nextTrain = moment().add(minutesAway, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));

            // Change HTML Elements to reflect changes on Train Schedule Data Table Section
            $("#trainTable").append(
                "<tr><td id='trainNameDisplay'>" + trainName +
                "</td><td id='destinationDisplay'>" + destination +
                "</td><td id='frequencyminDisplay'>" + frequency + " min " +
                "</td><td id='Next Arrival'>" + moment(nextTrain).format('LT') +
                "</td><td id='Minutes Away'>" + minutesAway + " minutes away" + "</td></tr>");

            // Handle the errors
        },
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );
});