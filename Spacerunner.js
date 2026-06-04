/*******************************************************/
// P5.play: Space runner game
// Written by Sonia Hassan
/*******************************************************/

//==================== CONSTANTS ====================//
const GAME_STATES = {
  MENU: "menu",            // The main menu screen
  INSTRUCTIONS: "instructions", // Screen showing how to play
  PLAY: "play",            // The game screen where you run
  END: "end"               // Game over screen
};

const GRAVITY = 0.9;        // Pulls the astronaut down
const JUMP_FORCE = -26;     // Pushes the astronaut up when jumping
const GAME_SPEED = -6;      // How fast the ground and obstacles move left

const ASTRONAUT_START_X = 120;          // Starting X position of astronaut
const GROUND_HEIGHT = 100;              // Height of the ground from bottom
const ASTRONAUT_GROUND_OFFSET = 157;    // Keeps astronaut above the ground

const OBSTACLE_GAP = 500;               // Space between obstacles

//==================== VARIABLES ====================//
let gameState = GAME_STATES.MENU;

let ground1, ground2, groundImage;
let astronaut, astronaut_start;
let obstacles = [];
let obstacle1, obstacle2, obstacle3;
let imgBG;
let score = 0;

//==================== PRELOAD ====================//

function preload() {
  imgBG = loadImage('imgs/sky.jpeg');
  groundImage = loadAnimation('imgs/ground.png');
  astronaut_start = loadAnimation('imgs/startposition.png');
  obstacle1 = loadAnimation('imgs/neptune.png');
  obstacle2 = loadAnimation('imgs/earth.png');
  obstacle3 = loadAnimation('imgs/planet.png');
}

//==================== SETUP ====================//
// Setup for the canvas and all game sprites
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create astronaut sprite and set starting position
  astronaut = new Sprite(ASTRONAUT_START_X, height - 95, 50, 100);
  astronaut.addAnimation("start", astronaut_start);
  astronaut.scale = 0.35;

  // Create two ground sprites for infinite scrolling effect
  ground1 = new Sprite(width / 2, height - 50, width, 50);
  ground1.addAnimation("ground", groundImage);
  ground1.velocity.x = GAME_SPEED;
  ground1.immovable = true;

  ground2 = new Sprite(width + width / 2, height - 50, width, 50);
  ground2.addAnimation("ground", groundImage);
  ground2.velocity.x = GAME_SPEED;
  ground2.immovable = true;

  // Create obstacles and store them in array
  let obstacleImages = [obstacle1, obstacle2, obstacle3];

  for (let i = 0; i < 3; i++) {
    let obs = new Sprite(width + i * OBSTACLE_GAP, 0, 50, 50);
    obs.addAnimation("planet" + i, obstacleImages[i]);
    obs.scale = 0.20;

    // Align obstacles with ground
    obs.position.y = ground1.position.y - 75;

    obs.passed = false;
    obs.velocity.x = GAME_SPEED;

    obstacles.push(obs);
  }
}

//==================== DRAW LOOP ====================//
function draw() {
  background(imgBG);

  if (gameState === GAME_STATES.MENU) {
    hideSprites();
    drawMenu();
  } else if (gameState === GAME_STATES.INSTRUCTIONS) {
    hideSprites();
    drawInstructions();
  } else if (gameState === GAME_STATES.PLAY) {
    showSprites();
    drawGame();
  } else if (gameState === GAME_STATES.END) {
    hideSprites();
    drawGameOver();
  }
}

//==================== MENU SCREEN ====================//
// Display the main menu and shows game title, instructions to start or to view instructions
function drawMenu() {
  textAlign(CENTER);
  fill("white");
  textSize(60);
  text("SPACE RUNNER", width / 2, height / 2 - 100);
  textSize(25);
  text("Press ENTER to Start", width / 2, height / 2);
  text("Press I for Instructions", width / 2, height / 2 + 40);
}

//==================== Instructions ====================//
//Display for the instructions screen 
function drawInstructions() {
  textAlign(CENTER);
  fill("white");
  textSize(40);
  text("Instructions", width / 2, 150);
  textSize(20);
  text("Press SPACE to Jump", width / 2, 250);
  text("Avoid the planets!", width / 2, 280);
  text("Survive as long as possible", width / 2, 310);
  text("TIP! press space double or triple times to jump higher", width / 2, 340);
  text("Press B to go back", width / 2, 400);
}

//==================== GAME ====================//
//Main gameplay function
//Handles astronaut movement, gravity, score, obstacles, collisions, and ground scrolling
function drawGame() {
  // Apply gravity
  astronaut.velocity.y += GRAVITY;

  // Keep astronaut on ground
  if (astronaut.position.y > height - ASTRONAUT_GROUND_OFFSET) {
    astronaut.position.y = height - ASTRONAUT_GROUND_OFFSET;
    astronaut.velocity.y = 0;
  }

  // Display score
  fill("white");
  textSize(30);
  textAlign(LEFT);
  text("Score: " + score, 20, 40);

  // Loop through obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];

    // Reset obstacle if it goes off screen
    if (obstacle.position.x < -50) {
      let maxX = 0;
      for (let j = 0; j < obstacles.length; j++) {
        if (obstacles[j].position.x > maxX) maxX = obstacles[j].position.x;
      }
      obstacle.position.x = maxX + OBSTACLE_GAP;
      obstacle.passed = false;
    }

    // Increase score when passing obstacle
    if (!obstacle.passed && obstacle.position.x < astronaut.position.x) {
      score += 1;
      obstacle.passed = true;
    }
    let dx = abs(astronaut.position.x - obstacle.position.x);
    let dy = abs(astronaut.position.y - obstacle.position.y);

  
    if (dx < 70 && dy < 90) {
      gameState = GAME_STATES.END;
      stopAllMovement();
    }
  }

  // Infinite scrolling ground
  if (ground1.position.x <= -width / 2) ground1.position.x = ground2.position.x + width;
  if (ground2.position.x <= -width / 2) ground2.position.x = ground1.position.x + width;
}

//==================== KEY PRESS ====================//
//Handle keyboard input
//Starts game, goes to instructions, restarts game, and makes astronaut jump
function keyPressed() {
  if (gameState === GAME_STATES.MENU && keyCode === ENTER) gameState = GAME_STATES.PLAY;
  if (gameState === GAME_STATES.MENU && key === "i") gameState = GAME_STATES.INSTRUCTIONS;
  if (gameState === GAME_STATES.INSTRUCTIONS && key === "b") gameState = GAME_STATES.MENU;
  if (gameState === GAME_STATES.END && key === "r") {
    resetGame();
    gameState = GAME_STATES.MENU;
  }

  // Jump
  if (gameState === GAME_STATES.PLAY && key === ' ') {
    if (astronaut.position.y >= height - ASTRONAUT_GROUND_OFFSET) {
      astronaut.velocity.y = JUMP_FORCE;
    }
  }
}

//==================== GAME OVER SCREEN ====================//
//Shows GAME OVER text and how to restart
function drawGameOver() {
  textAlign(CENTER);
  fill("white");
  textSize(60);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(25);
  text("Press R to Restart", width / 2, height / 2 + 40);
}

//==================== RESET FUNCTION ====================//
//Reset the game to the starting state
//Moves astronaut and obstacles back to starting positions and resets score
function resetGame() {
  astronaut.position.x = ASTRONAUT_START_X;
  astronaut.position.y = height - ASTRONAUT_GROUND_OFFSET;
  astronaut.velocity.y = 0;

  ground1.position.x = width / 2;
  ground1.velocity.x = GAME_SPEED;
  ground2.position.x = width + width / 2;
  ground2.velocity.x = GAME_SPEED;

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].position.x = width + i * OBSTACLE_GAP;
    obstacles[i].position.y = ground1.position.y - 75;
    obstacles[i].velocity.x = GAME_SPEED;
    obstacles[i].passed = false;
  }

  score = 0;
}

//==================== STOP MOVEMENT ====================//
//Stop all sprites movement
//Used when the game ends
function stopAllMovement() {
  astronaut.velocity.y = 0;
  ground1.velocity.x = 0;
  ground2.velocity.x = 0;

  for (let i = 0; i < obstacles.length; i++) obstacles[i].velocity.x = 0;
}

//==================== hideSprites ====================//
//Hide all sprites
//Used in menu, instructions, and game over screens
function hideSprites() {
  astronaut.visible = false;
  ground1.visible = false;
  ground2.visible = false;
  for (let i = 0; i < obstacles.length; i++) obstacles[i].visible = false;
}


//==================== showSprites ====================//
//Show all sprites
//Used during gameplay
function showSprites() {
  astronaut.visible = true;
  ground1.visible = true;
  ground2.visible = true;
  for (let i = 0; i < obstacles.length; i++) obstacles[i].visible = true;
}