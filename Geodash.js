/*******************************************************/
// P5.play: A simple game
// 
// This game can be used as an extra game for the 12COMP
// and 13COMP Databases assessments
//
// Written by Mr Britton
/*******************************************************/
console.log("Running the game");

function helloWorld() {
  console.log("Running helloWorld()")
  firebase.database().ref('/').set(
    {
      message: 'kia ora'
    }
  )
}
// End game code
function endGame(_player, _obstacle){
    console.log("Game ended, you got "+score+" points.")
    screenSelector = "end";
    player.remove();
    obstacles.removeAll();


}
