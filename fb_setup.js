 
 // Put your database writes here:
    const firebaseConfig = {
  apiKey: "AIzaSyCL5zHgKVWjbvLNWdaBoWsH3y6lSOVk-vw",
  authDomain: "comp-database-project-sonia.firebaseapp.com",
  databaseURL: "https://comp-database-project-sonia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp-database-project-sonia",
  storageBucket: "comp-database-project-sonia.firebasestorage.app",
  messagingSenderId: "1081815241129",
  appId: "1:1081815241129:web:b32d13a1e633eb7725f4b8"
};
 // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // This log prints the firebase object to the console to show that it is working.
  // As soon as you have the script working, delete this log.
  console.log("Firebase initialize finished:");
  console.log(firebase);