var GLOBAL_user; //Google's user object

//Set up a listener for the login state of the user
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}
// Run when the login state of the user changes. 
function fb_handleLogin(_user) {

    if (_user) {
        console.log("User is logged in");
        GLOBAL_user = _user;
        // Welcome message
        const welcomeText = document.getElementById("welcome");
        if (welcomeText) {
            welcomeText.innerHTML =
                "Welcome " + GLOBAL_user.displayName;
        }
        // Hide login button
        document.getElementById("loginSection").style.display = "none";
        // Show form section
        document.getElementById("formSection").style.display = "block";
    } else {
        console.log("User is Not logged in");
        // OPEN GOOGLE LOGIN
        fb_popupLogin();
    }
}

//Run the google login popup
function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user; //Save the user object to a global variable
        console.log("User has logged in")
    });
}

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");

function writeForm() {

    console.log("Writing form data");

    if (!GLOBAL_user) {
        alert("Please log in first");
        return;
    }

    // Get the values from the form
    const name = nameInput.value;
    const age = ageInput.value;
    
    // Save to Firebase using the user's uid
    firebase.database().ref('/userDetail/' + GLOBAL_user.uid).set({
        a_name: name,
        age: age
    })
    .then(() => {
        console.log("Form saved");
        // Show next button
        document.getElementById("nextSection").style.display = "block";
    })
}

function writeScore(gameName, score) {

    firebase.auth().onAuthStateChanged(function (user) {

        if (!user) {
            console.log("No user logged in");
            return;
        }

        firebase.database()
            .ref('/gameScores/' + gameName + '/' + user.uid)
            .set({
                score: score,
                playerName: user.displayName
            })

            .then(() => {
                console.log("Score saved!");
            })

            .catch((error) => {
                console.log("Error saving score");
                console.error(error);
            });

    });

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




