var GLOBAL_user; //Google's user object

//Set up a listener for the login state of the user
function fb_login() {
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}
// Run when the login state of the user changes. 
function fb_handleLogin(_user) {
    if (_user) {
        console.log("User is logged in")
        GLOBAL_user = _user;
        // Welcome message
        document.getElementById("welcome").innerHTML =
            "Welcome " + GLOBAL_user.displayName;
    } else {
        console.log("user is Not logged in - Starting the popup process")
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
    });
}

function writeScore(gameName, score) {

    if (!GLOBAL_user) {
        console.log("no user has logged in");
        return;
    }
    firebase.database().ref('/gameScores/' + gameName + '/' + GLOBAL_user.uid).set({ 
        score: score,
        playerName: GLOBAL_user.displayName
    })
    .then(() => {
        console.log("Score saved");
    })
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




