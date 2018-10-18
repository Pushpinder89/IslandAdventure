
// main display screen
$("#ending").hide();
$("#ReloadButton").hide();
$("#StartButton").click(function () {
    $("#mainScreen").hide();
    $("#game").show();
      mySound.play();
      mySound.loop = true;
});



//Get a reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

//The game map
var map =
[
  [0,2, 0, 0, 0, 6,0, 0],
  [0,0, 0, 0, 1, 0,0, 0],
  [2,0, 1, 0, 0, 2,0, 1],
  [0,0,0, 0, 6, 0,0, 0],
  [0,1, 0, 2, 0, 1,0, 0],
  [0,0, 0, 0, 0, 2,0, 2],
  [6,0, 2, 0, 1, 0,0, 3],
  [0,0, 0, 0, 0, 0,0, 1]

];

//The game objects map
var gameObjects =
[
  [4, 0, 5, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0],
  [0, 0, 0, 0, 0, 0,0,0]
];

var mapCode = {FOREST:0, PALM:1 ,FIGHTER:2 ,HOME:3 , PERSON:4 ,DRAGON:5 ,FIRE:6} //ES6 template literal

//The size of each cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//music
var mySound;
mySound = new Audio(["../images/Rhythm.mp3"]); //ES6 const

var mySoundEnd;
mySoundEnd = new Audio(["../images/SynthChime3.mp3" ]); //ES6 const

//Find the PERSON's and DRAGON's start positions
var PERSONRow;
var PERSONColumn;
var DRAGONRow;
var DRAGONColumn;

for(let row = 0; row < ROWS; row++)  //ES6 let
{
  for(let column = 0; column < COLUMNS; column++) //ES6 let
  {
    if(gameObjects[row][column] === mapCode.PERSON)
    {
      PERSONRow = row;
      PERSONColumn = column;
    }
    if(gameObjects[row][column] === mapCode.DRAGON)
    {
      DRAGONRow = row;
      DRAGONColumn = column;
    }
  }
}

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//The game variables
var food = 10;
var gold = 10;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way to the Treasure home.";

render();

function keydownHandler(event)
{

  switch(event.keyCode)
  {

    case UP:
    // mySound.play();
	    if(PERSONRow > 0)
	    {
	      //Clear the PERSON's current cell
	      gameObjects[PERSONRow][PERSONColumn] = 0;

	      //Subract 1 from the PERSON's row
	      PERSONRow--;

	      //Apply the PERSON's new updated position to the array
	      gameObjects[PERSONRow][PERSONColumn] = mapCode.PERSON;
	    }
	    break;

	  case DOWN:
      // mySound.play();
	    if(PERSONRow < ROWS - 1)
	    {
	      gameObjects[PERSONRow][PERSONColumn] = 0;
	      PERSONRow++;
	      gameObjects[PERSONRow][PERSONColumn] = mapCode.PERSON;
	    }
	    break;

	  case LEFT:
      // mySound.play();
	    if(PERSONColumn > 0)
	    {
	      gameObjects[PERSONRow][PERSONColumn] = 0;
	      PERSONColumn--;
	      gameObjects[PERSONRow][PERSONColumn] = mapCode.PERSON;
	    }
	    break;

	  case RIGHT:
      // mySound.play();
	    if(PERSONColumn < COLUMNS - 1)
	    {
	      gameObjects[PERSONRow][PERSONColumn] = 0;
	      PERSONColumn++;
	      gameObjects[PERSONRow][PERSONColumn] = mapCode.PERSON;
	    }
	    break;
  }

  //find out what kind of cell the PERSON is on
  switch(map[PERSONRow][PERSONColumn])
  {
    case mapCode.FOREST:
      gameMessage = "You find your way through this forest.";
      break;

    case mapCode.FIGHTER:
      fight();
      break;

    case mapCode.PALM:
      trade();
      break;

      case mapCode.FIRE:
        endGame();
        break;

    case mapCode.HOME:
      endGame();
      break;
  }

  //Move the DRAGON
  moveDRAGON();


  //Find out if the PERSON is touching the DRAGON
  if(gameObjects[PERSONRow][PERSONColumn] === mapCode.DRAGON)
  {
    endGame();
  }

  //Subtract some food each turn
  food--;

  //Find out if the PERSON has run out of food or gold
  if(food <= 0 || gold <= 0)
  {
    endGame();
  }

  //Render the game
  render();
}

function moveDRAGON()
{
  //The 4 possible directions that the DRAGON can move
var dragonDirection = { UP:1,DOWN:2, LEFT:3, RIGHT:4 };  //ES6 template literal
  //An array to store the valid direction that the DRAGON is allowed to move in
  var validDirections = [];

  //The final direction that the DRAGON will move in
  var direction = undefined;

  //Find out what kinds of things are in the cells that surround the DRAGON. If the cells contain FOREST, push the corresponding //direction into the validDirections array
  if(DRAGONRow > 0)
  {
    let thingAbove = map[DRAGONRow - 1][DRAGONColumn]; //ES6
        if(thingAbove === mapCode.FIGHTER)
	  {
	    validDirections.push(UP);
	  }
  }
  if(DRAGONRow < ROWS - 1)
  {
    let thingBelow = map[DRAGONRow + 1][DRAGONColumn];  //ES6
    if(thingBelow === mapCode.FOREST)
	  {
	    validDirections.push(DOWN);
	  }
  }
  if(DRAGONColumn > 0)
  {
    let thingToTheLeft = map[DRAGONRow][DRAGONColumn - 1]; //ES6
    if(thingToTheLeft === mapCode.FOREST)
	  {
	    validDirections.push(LEFT);
	  }
  }
  if(DRAGONColumn < COLUMNS - 1)
  {
    let thingToTheRight = map[DRAGONRow][DRAGONColumn + 1]; //ES6
    if(thingToTheRight === mapCode.FOREST)
	  {
	    validDirections.push(RIGHT);
	  }
  }

  //If a valid direction was found, Randomly choose one of the possible directions and assign it to the direction variable
  if(validDirections.length !== 0)
  {
    let randomNumber = Math.floor(Math.random() * validDirections.length); //ES6
    direction = validDirections[randomNumber];
  }

  //Move the DRAGON in the chosen direction
  switch(direction)
  {
    case UP:
      //Clear the DRAGON's current cell
		  gameObjects[DRAGONRow][DRAGONColumn] = 0;
		  //Subtract 1 from the DRAGON's row
		  DRAGONRow--;
		  //Apply the DRAGON's new updated position to the array
		  gameObjects[DRAGONRow][DRAGONColumn] = mapCode.DRAGON;
		  break;

	  case DOWN:
	    gameObjects[DRAGONRow][DRAGONColumn] = 0;
		  DRAGONRow++;
		  gameObjects[DRAGONRow][DRAGONColumn] = mapCode.DRAGON;
	    break;

	  case LEFT:
	    gameObjects[DRAGONRow][DRAGONColumn] = 0;
		  DRAGONColumn--;
		  gameObjects[DRAGONRow][DRAGONColumn] = mapCode.DRAGON;
	    break;

	 case RIGHT:
	    gameObjects[DRAGONRow][DRAGONColumn] = 0;
		  DRAGONColumn++;
		  gameObjects[DRAGONRow][DRAGONColumn] = mapCode.DRAGON;
  }
}

function trade()
{
  //Figure out how much food the PALM has and how much it should cost
  let PALMsFood = experience + gold;                //ES6
  let cost = Math.ceil(Math.random() * PALMsFood);  // ES6

  //Let the player buy food if there's enough gold to afford it
  if(gold > cost)
  {
    food += PALMsFood;
    gold -= cost;
    experience += 2;

    gameMessage
      = "You buy " + PALMsFood + " coconuts"
      + " for " + cost + " gold pieces."
  }
  else
  {
    //Tell the player if they don't have enough gold
    experience += 1;
    gameMessage = "You don't have enough gold to buy food."
  }
}

function fight()
{

  //The PERSONs strength
  let PERSONStrength = Math.ceil((food + gold) / 2);    //ES6

  //A random number between 1 and the PERSON's strength
  let FIGHTERStrength = Math.ceil(Math.random() * PERSONStrength * 2);  //ES6

  if(FIGHTERStrength > PERSONStrength)
  {
    //The FIGHTERs ransack the PERSON
    let stolenGold = Math.round(FIGHTERStrength / 2);  //ES6
    gold -= stolenGold;

    //Give the player some experience for trying
    experience += 1;

    //Update the game message
    gameMessage
      = "You fight and LOSE " + stolenGold + " gold pieces."
      + " PERSON's strength: " + PERSONStrength
      + " FIGHTER's strength: " + FIGHTERStrength;
  }
  else
  {
    //You win the FIGHTERs' gold
    let FIGHTERGold = Math.round(FIGHTERStrength / 2);  //ES6
    gold += FIGHTERGold;

    //Add some experience
    experience += 2;

    //Update the game message
    gameMessage
      = "You fight and WIN " + FIGHTERGold + " gold pieces."
      + " PERSON's strength: " + PERSONStrength
      + " FIGHTER's strength: " + FIGHTERStrength;
  }
}

function endGame()
{
  if(map[PERSONRow][PERSONColumn] === mapCode.HOME )
  {
    //Calculate the score
    let score = food + gold + experience;  //ES6

    //Display the game message
    gameMessage
      = "You made it home ALIVE! " + "Final Score: " + score;
  }
  if ( map[PERSONRow][PERSONColumn] === mapCode.FIRE)
  {
      let score = food + gold + experience;   //ES6
      gameMessage
        = "You Burned into the fire! " + "Final Score: " + score ;
      gameMessage += "   GAME OVER !" ;
  }
  else if(gameObjects[PERSONRow][PERSONColumn] === mapCode.DRAGON)
  {
    gameMessage
      = "Your PERSON has been swallowed by a forest DRAGON !  ";
     gameMessage += " GAME OVER !" ;
  }
  else
  {
    //Display the game message
    if(gold <= 0)
    {
      gameMessage += " You've run out of gold ! ";
    }
    else
    {
      gameMessage += " You've run out of food ! ";

    }

    gameMessage
      += " You fell back into the forest ! ";
      gameMessage += " GAME OVER !" ;
  }

  //Remove the keyboard listener to end the game
  window.removeEventListener("keydown", keydownHandler, false);
  mySound.pause();
  mySoundEnd.play();
  $(function () {
      $("#ending").show();
      $("#ReloadButton").show();
  });

  $("#ReloadButton").click(function () {
    location.reload();
  });

}


function render()
{
  //Clear the stage of img cells from the previous turn

  if(stage.hasChildNodes())
  {
    for(let i = 0; i < ROWS * COLUMNS; i++)  //ES6
    {
      stage.removeChild(stage.firstChild);
    }
  }

  //Render the game by looping through the map arrays
  for(let row = 0; row < ROWS; row++)   //ES6
  {
    for(let column = 0; column < COLUMNS; column++)  //ES6
    {
      //Create a img tag called cell
      let cell = document.createElement("img");    //ES6

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="stage"> tag
      stage.appendChild(cell);

      //Find the correct image for this map cell
      switch(map[row][column])
      {
        case mapCode.FOREST:
          // cell.src = "../images/FOREST.png";
          break;

        case mapCode.PALM:
          cell.src = "../images/palm-tree-icon.png";
          break;

        case mapCode.FIGHTER:
          cell.src = "../images/fightingIcon.png";
          break;

          case mapCode.FIRE:
            cell.src = "../images/fire-icon.png";
            break;

        case mapCode.HOME:
          cell.src = "../images/home-icon.png";
          break;
      }

      //Add the PERSON and DRAGON from the gameObjects array
	    switch(gameObjects[row][column])
	    {
	      case mapCode.PERSON:
	        cell.src = "../images/mainIcon.png";
	        break;

	      case mapCode.DRAGON:
	        cell.src = "../images/dragon-icon.png";
	        break;
	    }

      //Position the cell
      cell.style.top = row * SIZE + "px";
      cell.style.left = column * SIZE + "px";
    }
  }

  //Display the game message
	output.innerHTML = gameMessage;

	//Display the player's food, gold, and experience
	output.innerHTML
	  += "<br>Gold: " + gold + ", Food: "
	  + food + ", Experience: " + experience;
}
