var GLOBAL_user; // Google's user object

// ==========================
// START AUTH LISTENER
// ==========================
function fb_login() {
    firebase.auth().onAuthStateChanged(fb_handleLogin);
}
// ==========================
// HANDLE LOGIN STATE
// ==========================
function fb_handleLogin(_user) {
    if (_user) {
        console.log("User is logged in");
        GLOBAL_user = _user;
        // Welcome message
        const welcomeText =
            document.getElementById("welcome");
        if (welcomeText) {
            welcomeText.innerHTML =
                "Welcome " + GLOBAL_user.displayName;
        }
        // Hide login section
        const loginSection =
            document.getElementById("loginSection");
        if (loginSection) {
            loginSection.style.display = "none";
        }
        // CHECK IF USER DETAILS ALREADY EXIST
        firebase.database()
            .ref('/userDetail/' + GLOBAL_user.uid)
            .once('value')
            .then((snapshot) => {
                // USER HAS ALREADY FILLED FORM
                if (snapshot.exists()) {
                    console.log("User details already exist");
                    // Hide form
                    document.getElementById("formSection")
                        .style.display = "none";
                    // Show next section
                    document.getElementById("nextSection")
                        .style.display = "block";
                }
                // NEW USER
                else {
                    console.log("New user");
                    // Show form
                    document.getElementById("formSection")
                        .style.display = "block";
                    // Hide next section
                    document.getElementById("nextSection")
                        .style.display = "none";
                }
            })

            .catch(fb_readError);

    }

    else {

        console.log("User is NOT logged in");
        GLOBAL_user = null;
    }
}
// ==========================
// GOOGLE LOGIN POPUP
// ==========================

function fb_popupLogin() {
    console.log("BUTTON WORKS");
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            GLOBAL_user = result.user;
            console.log("User has logged in");
        })
        .catch(fb_readError);
}


function writeForm() {
    console.log("Writing form data");
    if (!GLOBAL_user) {
        alert("Please log in first");
        return;
    }
    const nameInput = document.getElementById("name");
    const ageInput = document.getElementById("age");
    // Get values
    const name = nameInput.value;
    const age = ageInput.value;
    // ==========================
    // VALIDATION
    // ==========================
    // Check if name is empty
    if (name === "") {
        alert("Please enter your name");
        nameInput.focus();
        return;
    }
    // Check if age is empty
    if (age === "") {
        alert("Please enter your age");
        ageInput.focus();
        return;
    }
    // Check if age is a number
    if (isNaN(age)) {
        alert("Age must be a number");
        ageInput.focus();
        return;
    }
    // Check if name is a number
    if (!isNaN(name)) {
        alert("Name must contain letters");
        nameInput.focus();
        return;
    }

    // Check valid age range
    if (age < 16 || age > 100) {
        alert("Please enter a valid age");
        ageInput.focus();
        return;
    }

    // ==========================
    // SAVE TO FIREBASE
    // ==========================
    firebase.database().ref('/userDetail/' + GLOBAL_user.uid).set({
        name: name,
        age: age
    })
        .then(() => {
            console.log("Form saved");
            document.getElementById("nextSection").style.display = "block";
        })
        .catch(fb_readError);
}
function writeScore(gameName, score) {
    if (!GLOBAL_user) {
        console.log("No user logged in");
        return;
    }
    firebase.database()
        .ref('/gameScores/' + gameName + '/' + GLOBAL_user.displayName)
        .set({
            username: GLOBAL_user.displayName,
            uid: GLOBAL_user.uid,
            score: score
        })
        .then(() => {
            console.log("Score saved!");
        })
        .catch(fb_readError);
}

function loadLeaderboard(gameName, elementID) {
    firebase.database()
        .ref('/gameScores/' + gameName)
        .orderByChild("score")
        .limitToLast(10)
        .once('value')
        .then((snapshot) => {
            let leaderboardHTML =
                "<h3>Top Scores</h3>";
            let scores = [];
            snapshot.forEach((childSnapshot) => {
                scores.push(childSnapshot.val());
            });
            for (let i = scores.length - 1; i >= 0; i--) {
                leaderboardHTML +=
                    '<div class="leaderboard-entry">' +
                    '<span class="uid">' +
                    scores[i].username +
                    '</span>' +
                    '<span class="score">' +
                    scores[i].score +
                    '</span>' +
                    '</div>';
            }
            document.getElementById(elementID).innerHTML =
                leaderboardHTML;
        })
        .catch(fb_readError);
}

function readForm() {
    console.log("Reading form data");

    firebase.database().ref('/userDetail/' + GLOBAL_user.uid)
        .once('value', displayForm, fb_readError);
}

function displayForm(snapshot) {

    let dbData = snapshot.val();

    console.log(dbData.name);
    console.log(dbData.age);

    HTML_OUTPUT.innerHTML =
        dbData.name + " is " + dbData.age + " years old";
}

function fb_readError(error) {
    console.log("Read Error");
    console.error(error);
}

fb_login();
loadLeaderboard("geoDash", "geoLeaderboard");
loadLeaderboard("spaceRunner", "spaceLeaderboard");







