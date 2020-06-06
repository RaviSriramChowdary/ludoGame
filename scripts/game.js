const cvs = document.getElementById("gameCanvas");
const ctx = cvs.getContext("2d");
cvs.width = 768;
cvs.height = cvs.width;

let unit = cvs.width / 12;
let gamePath = new Array();
let numPlay = 2;
let gamePlay = new Array(numPlay);
let numTokens = 4;

let clickX, clickY;

let gameTurn = "A";

let scoreA = 0,
scoreB = 0;
let hasKilled = false;

// console.log(gamePlay.length);

/*
There are two ways of coding this game:
   1. Tracing the tokens by their x-values, y-values
   2. Tracing each square on the game Path by the number of and types of tokens present in it.
*/

//first of all going in the first approach
//creating an object for each player that tracks the following :
/*
each and every of the token and thier x and y positions
is it their turn
number of tokens in the locker (this later will be calc dyanamically)
*/

//Object declaration
// 

for (let i = 0; i < gamePlay.length; i++) {
   if (i == 0) {
      gamePlay[i] = {
         tokenPosArray: [
            { x: -1, y: -1 },
            { x: -1, y: -1 },
            { x: -1, y: -1 },
            { x: -1, y: -1 },
         ],
         symbol: "A",
         numTokenInLocker: numTokens,
      };
   } /*if (i == 0)*/ else {
      gamePlay[i] = {
         tokenPosArray: [
            { x: -1, y: -1 },
            { x: -1, y: -1 },
            { x: -1, y: -1 },
            { x: -1, y: -1 },
         ],
         symbol: "B",
         numTokenInLocker: numTokens,
      };
   }
}

//Funtion to add the next component of the array

const addNext = (x, y, array) => {
   array.push({ x: x, y: y });
};

//Function to define the Game Path
const defineGamePath = () => {
   gamePath[0] = {
      x: 0,
      y: 0,
   };
   let pathLength = 4 * (cvs.width / unit) - 4;
   let tobepushed;
   let dir = "right";
   for (let i = 1; i < pathLength; i++) {
      if (i == cvs.width / unit) dir = "down";
      if (i == 2 * (cvs.width / unit) - 1) dir = "left";
      if (i == 3 * (cvs.width / unit) - 2) dir = "up";

      if (dir === "right") {
         tobepushed = {
            x: gamePath[i - 1].x + unit,
            y: gamePath[i - 1].y,
         };
      }
      if (dir === "left") {
         tobepushed = {
            x: gamePath[i - 1].x - unit,
            y: gamePath[i - 1].y,
         };
      }
      if (dir === "up") {
         tobepushed = {
            x: gamePath[i - 1].x,
            y: gamePath[i - 1].y - unit,
         };
      }
      if (dir === "down") {
         tobepushed = {
            x: gamePath[i - 1].x,
            y: gamePath[i - 1].y + unit,
         };
      }
      let a = tobepushed.x;
      let b = tobepushed.y;
      addNext(a, b, gamePath);
   }
};

let dieValue = Math.floor(Math.random() * 6 + 1);

function rollDie() {
   if (dieValue != 6 && hasKilled == false) changeTurn();
   hasKilled = false;
   dieValue = Math.floor(Math.random() * 6 + 1);
   rollDice();
   // if (dieValue > 6) {
   //    dieValue = 13 - dieValue;
   // }
   hasRolled = true;
}
function rollDice() {
   let dice = document.getElementById("frd");
   toggleClasses(dice);
}
let rollNum;
let evenorodd;

function toggleClasses(die) {
   if (document.getElementById("die").classList[0] == "even") evenorodd = 2;
   else evenorodd = 1;

   document.getElementById("die").classList.toggle("even");
   document.getElementById("die").classList.toggle("odd");

   die.classList = ["faceRelDiv"];
   dieValue = getRandomNumber(1, 6);
   document.getElementById("numHolder").innerHTML = dieValue;
   if (dieValue == 1) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto1");
      else die.setAttribute("class", die.getAttribute("class") + " goto7");
   }
   if (dieValue == 2) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto2");
      else die.setAttribute("class", die.getAttribute("class") + " goto8");
   }
   if (dieValue == 3) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto3");
      else die.setAttribute("class", die.getAttribute("class") + " goto9");
   }
   if (dieValue == 4) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto4");
      else die.setAttribute("class", die.getAttribute("class") + " goto10");
   }
   if (dieValue == 5) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto5");
      else die.setAttribute("class", die.getAttribute("class") + " goto11");
   }
   if (dieValue == 6) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto6");
      else die.setAttribute("class", die.getAttribute("class") + " goto12");
   }
}

function getRandomNumber(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("dieHolder").addEventListener("click", rollDie);
const changeTurn = () => {
   if (gameTurn == "A") gameTurn = "B";
   else if (gameTurn == "B") gameTurn = "A";
};

defineGamePath();

//Initalisation of plots which mean the different squares on the board

let plots = new Array(gamePath.length);

for (let i = 0; i < plots.length; i++) {
   plots[i] = {
      tokens: [],
      numTokenA: 0,
      numTokenB: 0,
      x: gamePath[i].x,
      y: gamePath[i].y,
   };
}
let hasRolled = false;

function updateGame() {
   for (let i = 0; i < plots.length; i++) {
      if (gameTurn == "A") {
         if (hasRolled == true) {
            if (
               clickX >= plots[i].x &&
               clickX <= plots[i].x + unit &&
               clickY >= plots[i].y &&
               clickY <= plots[i].y + unit &&
               plots[i].numTokenA > 0
            ) {
               plots[i].numTokenA--;
               if (i + dieValue < 44) {
                  plots[i + dieValue].numTokenA++;
                  if (plots[i + dieValue].numTokenB > 0) {
                     gamePlay[1].numTokenInLocker +=
                        plots[i + dieValue].numTokenB;
                     plots[i + dieValue].numTokenB = 0;
                     gameTurn = "A";
                     hasKilled = true;
                  }
               } else scoreA++;

               clickX = -10;
               clickY = -10;
               hasRolled = false;
            }
         }
      } else if (gameTurn == "B") {
         if (hasRolled == true) {
            if (
               clickX >= plots[i].x &&
               clickX <= plots[i].x + unit &&
               clickY >= plots[i].y &&
               clickY <= plots[i].y + unit &&
               plots[i].numTokenB > 0
            ) {
               plots[i].numTokenB--;
               if (i + dieValue < 44) {
                  plots[i + dieValue].numTokenB++;
                  if (plots[i + dieValue].numTokenA > 0) {
                     gamePlay[0].numTokenInLocker +=
                        plots[i + dieValue].numTokenA;
                     plots[i + dieValue].numTokenA = 0;
                     gameTurn = "B";
                     hasKilled = true;
                  }
               } else scoreB++;

               clickX = -10;
               clickY = -10;
               hasRolled = false;
            }
         }
      }
   }

   if (gameTurn == "A") {
      if (dieValue == 6 && hasRolled == true) {
         if (
            clickX >= 1.5 * unit &&
            clickX <= 3 * unit &&
            clickY >= 1.5 * unit &&
            clickY <= 3 * unit &&
            gamePlay[0].numTokenInLocker > 0
         ) {
            plots[0].numTokenA++;
            gamePlay[0].numTokenInLocker--;
            clickX = -10;
            clickY = -10;
            hasRolled = false;
         }
      }
   } else if (gameTurn == "B") {
      if (dieValue == 6 && hasRolled == true) {
         if (
            clickX >= 9 * unit &&
            clickX <= 10.5 * unit &&
            clickY >= 9 * unit &&
            clickY <= 10.5 * unit &&
            gamePlay[1].numTokenInLocker > 0
         ) {
            plots[22].numTokenB++;
            gamePlay[1].numTokenInLocker--;
            clickX = -10;
            clickY = -10;
            hasRolled = false;
         }
      }
   }
}

document.addEventListener("mousedown", mouseClickDetect, false);

function mouseClickDetect(event) {
   let rect = cvs.getBoundingClientRect();
   let x = event.clientX - rect.left;
   let y = event.clientY - rect.top;
   clickX = x;
   clickY = y;
}

document.addEventListener("touchstart", touchPositionDetect, false);

function touchPositionDetect(event) {
   let rect = cvs.getBoundingClientRect();
   let x = event.clientX - rect.left;
   let y = event.clientY - rect.top;
   clickX = x;
   clickY = y;
}

function drawGame() {
   //Redrawing the background each time

   ctx.fillStyle = "salmon";

   //Drawing the boxes for the game play

   ctx.fillRect(0, 0, cvs.width, cvs.height);
   ctx.strokeStyle = "black";
   for (let i = 0; i < gamePath.length; i++) {
      ctx.strokeRect(gamePath[i].x, gamePath[i].y, unit, unit);
   }

   // Writing the Number of the die on the canvas

   //ctx.strokeStyle = "black";
   ctx.strokeRect(5 * unit, 5 * unit, 2 * unit, 2 * unit);

   ctx.fillStyle = "black";
   ctx.font = "50px Arial";
   ctx.fillText(dieValue, 5.8 * unit, 6.2 * unit);

   //Writing whose turn is now

   ctx.font = "50px Arial";
   ctx.fillText(gameTurn, 5.8 * unit, 4.5 * unit);

   // Drawing the lockers for the players

   ctx.fillStyle = "crimson";
   ctx.fillRect(1.5 * unit, 1.5 * unit, 1.5 * unit, 1.5 * unit);
   ctx.strokeRect(1.5 * unit, 1.5 * unit, 1.5 * unit, 1.5 * unit);

   ctx.fillStyle = "indigo";
   ctx.fillRect(9 * unit, 9 * unit, 1.5 * unit, 1.5 * unit);
   ctx.strokeRect(9 * unit, 9 * unit, 1.5 * unit, 1.5 * unit);

   // Writing the number of tokens inside the locker

   ctx.fillStyle = "black";
   ctx.fillText(
      gamePlay[0].numTokenInLocker + gamePlay[0].symbol,
      1.8 * unit,
      2.5 * unit
   );
   ctx.fillText(
      gamePlay[1].numTokenInLocker + gamePlay[1].symbol,
      9.3 * unit,
      10 * unit
   );
   ctx.font = "24px Arial";
   ctx.fillText("Score: " + scoreA, 3.3 * unit, 2.6 * unit);
   ctx.fillText("Score: " + scoreB, 7.3 * unit, 10 * unit);

   //Writing the number and symbol at the position of the token except when it is inside the locker
   ctx.font = "24px Arial";
   for (let i = 0; i < plots.length; i++) {
      if (plots[i].numTokenA > 0) {
         ctx.fillText(
            plots[i].numTokenA + "A",
            plots[i].x + 10,
            plots[i].y + unit - 10
         );
      }
      if (plots[i].numTokenB > 0) {
         ctx.fillText(
            plots[i].numTokenB + "B",
            plots[i].x + 30,
            plots[i].y + 24
         );
      }
   }
   updateGame();
}

setInterval(drawGame, 100);
