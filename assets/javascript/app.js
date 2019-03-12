$(document).ready(function () {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCXkDIgMgz3M4YPQSTlWGWrdk8f1ySF2Cg",
        authDomain: "trainscheduler-1d46f.firebaseapp.com",
        databaseURL: "https://trainscheduler-1d46f.firebaseio.com",
        projectId: "trainscheduler-1d46f",
        storageBucket: "trainscheduler-1d46f.appspot.com",
        messagingSenderId: "496137474893"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //Variables
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });
    
    database.ref().on("child_added", function (childSnapshot) {
        var nextArr;
        var minAway;
        //change the year so the first train arrives before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and first train
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        //minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        //next train
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);

    });

});