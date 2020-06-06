// Canvas Implementation of ther game
const cvs = document.getElementById("gameCanvas");
const cvsHolder = document.getElementById("canvasHolder");
const ctx = cvs.getContext("2d");
cvs.width = 720;
cvs.height = cvs.width;
cvsHolder.style.width = cvs.offsetWidth + "px";

let hasRolled, hasMoved, canRoll, hasKilled, hasHomed, canMove;

hasRolled = false;
hasMoved = false;
canRoll = true;
hasKilled = false;
hasHomed = false;

let whoseTurn = 0;
let dieValue = 0;

let numPlayers = 3;
let gameOrder = new Array(numPlayers);
gameOrder = [1,  3,4 ];
let numTokens = 4;

let numSquares = 15;
let pathLength = 4 * numSquares - 4;

let gamePlay = new Array(numPlayers + 1);
let gamePath = new Array();
let pathSquares = new Array(gamePath.length);

let clickedX, clickedY;

let score = [-1, 0, 0, 0, 0];

let unit = cvs.width / numSquares;

const definePath = () => {
   gamePath[0] = {
      x: 0,
      y: 0,
   };

   let drawDir = "right";
   let nextX, nextY;

   for (let i = 1; i < pathLength; i++) {
      if (i == numSquares) drawDir = "down";
      if (i == 2 * numSquares - 1) drawDir = "left";
      if (i == 3 * numSquares - 2) drawDir = "up";

      if (drawDir === "right") {
         nextX = gamePath[i - 1].x + unit;
         nextY = gamePath[i - 1].y;
      }
      if (drawDir === "left") {
         nextX = gamePath[i - 1].x - unit;
         nextY = gamePath[i - 1].y;
      }
      if (drawDir === "up") {
         nextX = gamePath[i - 1].x;
         nextY = gamePath[i - 1].y - unit;
      }
      if (drawDir === "down") {
         nextX = gamePath[i - 1].x;
         nextY = gamePath[i - 1].y + unit;
      }

      addNext(nextX, nextY, gamePath);
   }

   for (let i = 0; i < pathLength; i++) {
      pathSquares[i] = {
         x: gamePath[i].x,
         y: gamePath[i].y,
         id: i,
         numTokensPlayer: [0, 0, 0, 0, 0],
         isSafeSquare: false,
      };
      if (i % ((numSquares - 1) / 2) == 0) {
         pathSquares[i].isSafeSquare = true;
      }
   }
   for (let i = 0; i < pathLength; i++) {
      //if (pathSquares[i].isSafeSquare) ////console.log(i);
   }
};

const addNext = (x, y, array) => {
   array.push({ x: x, y: y });
};

const colors = ["black", "#DC1924", "#2AA44A", "#FFDE16", "#0EABDE"];
//sample codes here:

let lockers = [
   { x: 2 * unit, y: 2 * unit },
   { x: 1.5 * unit, y: 1.5 * unit },
   { x: cvs.width / 2 + 0.5 * unit, y: 1.5 * unit },
   { x: cvs.width / 2 + 0.5 * unit, y: cvs.width / 2 + 0.5 * unit },
   { x: 1.5 * unit, y: cvs.width / 2 + 0.5 * unit },
];

let lockWidth = cvs.width / 2 - 2 * unit;

const drawToCvs = () => {
   //Drawing the path
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, cvs.width, cvs.height);

   ctx.strokeStyle = "black";

   for (let i = 0; i < pathLength; i++) {
      ctx.fillStyle = "white";
      if (i == 0) ctx.fillStyle = "#DC1924";
      if (i == 4 * numSquares - 5) ctx.fillStyle = "#FCA9A9";
      if (i == numSquares - 1) ctx.fillStyle = "#2AA44A";
      if (i == numSquares - 2) ctx.fillStyle = "#77D18D";
      if (i == 2 * numSquares - 2) ctx.fillStyle = "#FFDE16";
      if (i == 2 * numSquares - 3) ctx.fillStyle = "#f2e28a";
      if (i == 3 * numSquares - 3) ctx.fillStyle = "#0EABDE";
      if (i == 3 * numSquares - 4) ctx.fillStyle = "#9fe4f9";
      ctx.fillRect(gamePath[i].x, gamePath[i].y, unit, unit);

      ctx.strokeStyle = "#00000010";
      ctx.lineWidth = unit / 8;
      let x = ctx.lineWidth;
      ctx.strokeRect(
         gamePath[i].x + x / 2,
         gamePath[i].y + x / 2,
         unit - x,
         unit - x
      );

      ctx.strokeStyle = "#00000050";
      ctx.lineWidth = 1;
      ctx.strokeRect(
         gamePath[i].x + x / 2,
         gamePath[i].y + x / 2,
         unit - x,
         unit - x
      );

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(gamePath[i].x, gamePath[i].y, unit, unit);

      ctx.font = "18px Arial";
      ctx.fillStyle = "black";
      for (let j = 1; j < numTokens + 1; j++) {
         if (pathSquares[i].numTokensPlayer[j] > 0) {
            for (let l = 0; l < pathSquares[i].numTokensPlayer[j]; l++) {
               drawToken(
                  gamePath[i].x + unit / 2,
                  gamePath[i].y + unit / 2,
                  colors[j],
                  1 / pathSquares[i].numTokensPlayer[j]
               );
            }
         }
      }
   }
   lockWidth = cvs.width / 2 - 2 * unit;
   ctx.strokeStyle = "black";
   for (let i = 1; i <= 4; i++) {
      switch (i) {
         case 1:
            ctx.fillStyle = "#DC1924";
            break;
         case 2:
            ctx.fillStyle = "#2AA44A";
            break;
         case 3:
            ctx.fillStyle = "#FFDE16";
            break;
         case 4:
            ctx.fillStyle = "#0EABDE";
            break;
         default:
            ctx.fillStyle = "black";
            break;
      }
      ctx.fillRect(lockers[i].x, lockers[i].y, lockWidth, lockWidth);
      ctx.strokeRect(lockers[i].x, lockers[i].y, lockWidth, lockWidth);

      ctx.lineWidth = 5;
      ctx.strokeStyle = "white";
      if (whoseTurn == 0)
         ctx.strokeRect(
            lockers[1].x + unit / 4,
            lockers[1].y + unit / 4,
            lockWidth - unit / 2,
            lockWidth - unit / 2
         );
      else
         ctx.strokeRect(
            lockers[whoseTurn].x + unit / 4,
            lockers[whoseTurn].y + unit / 4,
            lockWidth - unit / 2,
            lockWidth - unit / 2
         );

      ctx.lineWidth = 2;
      ctx.strokeStyle = "gold";
      if (whoseTurn == 0)
         ctx.strokeRect(
            lockers[1].x + unit / 4,
            lockers[1].y + unit / 4,
            lockWidth - unit / 2,
            lockWidth - unit / 2
         );
      else
         ctx.strokeRect(
            lockers[whoseTurn].x + unit / 4,
            lockers[whoseTurn].y + unit / 4,
            lockWidth - unit / 2,
            lockWidth - unit / 2
         );

      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";

      for (let j = 0; j < numTokens; j++) {
         let centerX, centerY;
         ctx.beginPath();
         ctx.fillStyle = "white";
         if (j == 0) {
            centerX = lockers[i].x + lockWidth / 4;
            centerY = lockers[i].y + lockWidth / 4;
            ctx.arc(centerX, centerY, lockWidth / 8, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            if (gamePlay[i].numTokenInLocker > j) {
               drawToken(centerX, centerY, colors[i], 1);
            }
         }
         if (j == 1) {
            centerX = lockers[i].x + (3 * lockWidth) / 4;
            centerY = lockers[i].y + lockWidth / 4;
            ctx.arc(centerX, centerY, lockWidth / 8, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            if (gamePlay[i].numTokenInLocker > j) {
               drawToken(centerX, centerY, colors[i], 1);
            }
         }
         if (j == 2) {
            centerX = lockers[i].x + lockWidth / 4;
            centerY = lockers[i].y + (3 * lockWidth) / 4;
            ctx.arc(centerX, centerY, lockWidth / 8, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            if (gamePlay[i].numTokenInLocker > j) {
               drawToken(centerX, centerY, colors[i], 1);
            }
         }
         if (j == 3) {
            centerX = lockers[i].x + (3 * lockWidth) / 4;
            centerY = lockers[i].y + (3 * lockWidth) / 4;
            ctx.arc(centerX, centerY, lockWidth / 8, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            if (gamePlay[i].numTokenInLocker > j) {
               drawToken(centerX, centerY, colors[i], 1);
            }
         }
      }
   }

   // ctx.font = unit + "px Arial";
   // ctx.fillStyle = "black";
   // ctx.fillText(dieValue, (numSquares * unit) / 2, (numSquares * unit) / 2);
   ctx.font = unit / 2 + "px Arial";
   ctx.fillStyle = "black";
   // ctx.fillText(
   //    "Player No: " + whoseTurn,
   //    (numSquares * unit) / 2 - unit,
   //    (numSquares * unit) / 2 - unit
   // );

   for (let k = 0; k < numPlayers; k++) {
      ctx.fillText(
         "Score: " + score[[gameOrder[k]]],
         lockers[[gameOrder[k]]].x + 30,
         lockers[[gameOrder[k]]].y + 30
      );
   }
};

function drawToken(x, y, color, factor) {
   ctx.strokeStyle = "black";
   ctx.beginPath();
   ctx.arc(x, y, (unit / 4) * factor, 0, 2 * Math.PI);
   ctx.stroke();
   ctx.fillStyle = color;
   ctx.fill();

   ctx.beginPath();
   ctx.arc(x, y, (unit / 6) * factor, 0, 2 * Math.PI);
   ctx.stroke();
   ctx.fillStyle = "white";
   ctx.fill();

   ctx.beginPath();
   ctx.arc(x, y, (unit / 10) * factor, 0, 2 * Math.PI);
   ctx.stroke();
   ctx.fillStyle = color;
   ctx.fill();
}

const defineGamePlay = () => {
   for (let i = 1; i <= 4; i++) {
      let counter = 0;
      gameOrder.forEach((value, index) => {
         if (i == value) {
            counter++;
         }
      })
      if(counter > 0)
         gamePlay[i] = {
            numTokenInLocker: numTokens,
            tokensPositions: [-1, -1, -1, -1],
         };
      else
         gamePlay[i] = {
            numTokenInLocker: 0,
            tokensPositions: [-1, -1, -1, -1],
         };
   }
};

const trackTokens = () => {
   for (let i = 1; i <= numPlayers; i++) {
      let n = 0;
      gamePlay[i].tokensPositions = [-1, -1, -1, -1];
      for (let j = 0; j < pathLength; j++) {
         if (pathSquares[j].numTokensPlayer[i] > 0) {
            let k = n + pathSquares[j].numTokensPlayer[i];
            for (let l = n; l < k; l++) {
               gamePlay[i].tokensPositions[l] = j;
            }
            n = k;
         }
      }
   }
};

function isOnetokenPresent() {}

const scaleNum = (num, factor) => {
   let result;
   let corr = (factor - 1) * (numSquares - 1);
   if (factor === 1) {
      result = num;
   } else {
      if (num >= 4 * numSquares - 4 - corr)
         result = num - (4 * numSquares - 4 - corr);
      else {
         result = num + corr;
      }
   }
   return result;
};

const resetClicks = () => {
   clickedX = -10;
   clickedY = -10;
};

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 0.7));

// document.getElementById("header").addEventListener(
//    "click",
//    function () {
//       if (whoseTurn != 0) isThereAMove();
//       if (canRoll) rollDie();
//       else {
//          if (!canMove) rollDie();
//       }
//    },
//    false
// );

// document.getElementById('goNext').addEventListener('click', function () {
//    document.getElementById("welcome").style.display = "none";
//    document.getElementById('selectorColor').style.display = "block";
// })

// document.getElementById("startGame").addEventListener("click", function () {
//    document.getElementById("selectorColor").style.display = "none";
// });

let hasalreadySwitched = false;

function rollDie() {
   // if (dieValue != 6 && !hasKilled && !hasHomed && !hasalreadySwitched) {
   //    switchPlayer();
   // }
   hasalreadySwitched = false;
   canRoll = false;
   hasMoved = false;
   if (document.getElementById("rollorin").checked) dieValue = rand(1, 6);
   else dieValue = parseInt(document.getElementById("inValue").value);
   resetClicks();
   drawToCvs();
}

function switchPlayer() {
   console.log("Switching: Initial Player : " + whoseTurn);
   if (whoseTurn == 0) {
      whoseTurn = gameOrder[0];
   } else
      for (let j = 0; j < numPlayers; j++) {
         if (whoseTurn == gameOrder[j]) {
            if (j < numPlayers - 1) {
               whoseTurn = gameOrder[j + 1];
               break;
            } else {
               whoseTurn = gameOrder[0];
               break;
            }
         }
      }
   console.log("Switching Completed: Final Player : " + whoseTurn);
}

function updateGame() {
   hasRolled = false;
   hasKilled = false;
   hasHomed = false;
   canMove = false;

   //opening a token from locker:

   if (
      dieValue == 6 &&
      hasClickedon(
         lockers[whoseTurn].x,
         lockers[whoseTurn].y,
         lockWidth,
         lockWidth
      ) &&
      hasMoved == false &&
      gamePlay[whoseTurn].numTokenInLocker > 0
   ) {
      gamePlay[whoseTurn].numTokenInLocker--;
      pathSquares[scaleNum(0, whoseTurn)].numTokensPlayer[whoseTurn]++;
      hasMoved = true;
      canRoll = true;
   }

   //if the token is in other square updating it:

   for (let i = 0; i < pathLength; i++) {
      if (
         hasClickedon(pathSquares[i].x, pathSquares[i].y, unit, unit) &&
         hasMoved == false &&
         pathSquares[i].numTokensPlayer[whoseTurn] > 0
      ) {
         let temp = i;

         //should pass the first barrier

         if (temp + dieValue > pathLength - 1) {
            temp -= pathLength;
         }

         //should not pass their barriers
         if (
            temp < scaleNum(0, whoseTurn) &&
            temp + dieValue >= scaleNum(0, whoseTurn)
         ) {
            break;
         }

         let counter = 0;

         for (let m = 1; m <= 4; m++) {
            if (
               m != whoseTurn &&
               pathSquares[temp + dieValue].numTokensPlayer[m] > 0
            ) {
               gamePlay[m].numTokenInLocker +=
                  pathSquares[temp + dieValue].numTokensPlayer[m];
               pathSquares[temp + dieValue].numTokensPlayer[m] = 0;
               hasKilled = true;
            }
            if (
               m == whoseTurn &&
               pathSquares[temp + dieValue].numTokensPlayer[m] > 0
            ) {
               counter++;
            }
         }

         if (counter > 0) break;

         //if they reach thier home place they score

         if (temp + dieValue == scaleNum(pathLength - 1, whoseTurn)) {
            score[whoseTurn]++;
            hasHomed = true;
         } else {
            pathSquares[temp + dieValue].numTokensPlayer[whoseTurn]++;
         }

         pathSquares[i].numTokensPlayer[whoseTurn]--;
         hasMoved = true;
         canRoll = true;
         isThereAMove();
         if (
            ((hasMoved ||
            !canMove) &&
            !hasKilled &&
            !hasHomed &&
            dieValue != 6 &&
            !hasalreadySwitched) || !canMove
         ) {
            switchPlayer();
            hasalreadySwitched = true;
         }
      }
   }

   if (score[whoseTurn] == 4) {
      winOrder.push(whoseTurn);
      let place;
      gameOrder.forEach((value, index) => {
         if (value == whoseTurn) {
            place = index;
         }
      })
      gameOrder.splice(place, 1);
      numPlayers--;
   }

   //drawing the changes to the canvas
   trackTokens();
   drawToCvs();
}

let winOrder = [];

function isThereAMove() {
   canMove = true;

   //If all open tokens are in locker and six is not rolled

   if (
      dieValue != 6 &&
      gamePlay[whoseTurn].numTokenInLocker == numTokens - score[whoseTurn]
   ) {
      canMove = false;
   } else if (dieValue == 6) {
      canMove = true;
   } else {
      let canMoveConditionCounter = 0;

      //if the token is in other square updating it:

      for (let i = 0; i < numTokens; i++) {
         if (gamePlay[whoseTurn].tokensPositions[i] > 0) {
            //condition for a free token
            let insideCounter = 0;
            let temp = gamePlay[whoseTurn].tokensPositions[i];
            if (temp + dieValue > pathLength - 1) {
               temp -= pathLength;
            }

            if (
               temp < scaleNum(0, whoseTurn) &&
               temp + dieValue >= scaleNum(0, whoseTurn)
            ) {
               insideCounter++;
            }

            for (let j = 0; j < numTokens; j++) {
               if (temp + dieValue == gamePlay[whoseTurn].tokensPositions[j]) {
                  insideCounter++;
               }
            }
            if (insideCounter > 0) {
               canMoveConditionCounter++;
            }
         }
      }

      if (
         canMoveConditionCounter ==
         numTokens - score[whoseTurn] - gamePlay[whoseTurn].numTokenInLocker
      )
         canMove = false;
   }
   //console.log(canMove);
}

const hasClickedon = (x, y, w, h) =>
   clickedX > x && clickedX < x + w && clickedY > y && clickedY < y + h;

cvs.addEventListener("click", touchPositionDetect, false);
cvs.addEventListener("touchstart", touchPositionDetect, false);

function touchPositionDetect(event) {
   let rect = cvs.getBoundingClientRect();
   let x = event.clientX - rect.left;
   let y = event.clientY - rect.top;
   clickedX = x;
   clickedY = y;
   updateGame();
}

defineGamePlay();
definePath();
drawToCvs();
