// Canvas Implementation of ther game
const cvs = document.getElementById("gameCanvas");
const cvsHolder = document.getElementById("canvasHolder");
const ctx = cvs.getContext("2d");
cvs.width = 720;
cvs.height = cvs.width;
cvsHolder.style.width = cvs.offsetWidth + "px";

let hasRolled, hasMoved, canRoll, hasKilled, hasHomed;

hasRolled = false;
hasMoved = false;
canRoll = true;
hasKilled = false;
hasHomed = false;

let whoseTurn = 0;
let dieValue = 0;

let numPlayers = 4;
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
      if (i == numSquares - 1) ctx.fillStyle = "#2AA44A";
      if (i == 2 * numSquares - 2) ctx.fillStyle = "#FFDE16";
      if (i == 3 * numSquares - 3) ctx.fillStyle = "#0EABDE";
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
   for (let i = 1; i <= numPlayers; i++) {
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

   ctx.font = unit + "px Arial";
   ctx.fillStyle = "black";
   ctx.fillText(dieValue, (numSquares * unit) / 2, (numSquares * unit) / 2);
   ctx.font = unit / 2 + "px Arial";
   ctx.fillStyle = "black";
   ctx.fillText(
      "Player No: " + whoseTurn,
      (numSquares * unit) / 2 - unit,
      (numSquares * unit) / 2 - unit
   );

   for (let k = 1; k <= numPlayers; k++) {
      ctx.fillText("Score: " + score[k], lockers[k].x + 30, lockers[k].y + 30);
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
   for (let i = 1; i <= numPlayers; i++) {
      gamePlay[i] = {
         numTokenInLocker: numTokens,
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
            n = n + k;
         }
      }
   }
};

const isThereAMove = () => {
   
}

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
   ////console.log(result + " and corr is: " + corr);
   return result;
};

const resetClicks = () => {
   clickedX = -10;
   clickedY = -10;
};

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 0.7));

document.getElementById("header").addEventListener(
   "click",
   function () {
      ////console.log("canRoll: " + canRoll);
      if (canRoll) rollDie();
      else {
         if (
            gamePlay[whoseTurn].numTokenInLocker ==
               numTokens - score[whoseTurn] &&
            dieValue != 6
         )
            rollDie();
      }
   },
   false
);

// document.getElementById('goNext').addEventListener('click', function () {
//    document.getElementById("welcome").style.display = "none";
//    document.getElementById('selectorColor').style.display = "block";
// })

// document.getElementById("startGame").addEventListener("click", function () {
//    document.getElementById("selectorColor").style.display = "none";
// });

function rollDie() {
   if (dieValue != 6 && !hasKilled && !hasHomed) {
      switchPlayer();
   }
   canRoll = false;
   hasMoved = false;
   if (document.getElementById("rollorin").checked) dieValue = rand(1, 6);
   else dieValue = parseInt(document.getElementById("inValue").value);
   resetClicks();
   drawToCvs();
}

const switchPlayer = () => {
   if (whoseTurn == numPlayers) {
      whoseTurn = 1;
   } else whoseTurn++;
   // if (whoseTurn == 0) {
   //    whoseTurn = 1;
   // }
   // else if (whoseTurn == 1) {
   //    whoseTurn = 3;
   // }
   // else if (whoseTurn == 3) {
   //    whoseTurn = 2;
   // }

   // else if (whoseTurn == 2) {
   //    whoseTurn = 4;
   // }

   // else if (whoseTurn == 4) {
   //    whoseTurn = 1;
   // }
};

//number is 6 => no switch
//has killed => no switch
//has homed => no switch
// num!=6 && !haskilled && !hashomed

//has moved then only roll die
//not 6 and   has not moved but also no coin to move- also can roll die

function updateGame() {
   //opening a token from locker:
   hasRolled = false;
   hasKilled = false;
   hasHomed = false;
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
      //////console.log("dimpadu");
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

         for (let m = 1; m <= numPlayers; m++) {
            if (
               m != whoseTurn &&
               pathSquares[temp + dieValue].numTokensPlayer[m] > 0
            ) {
               gamePlay[m].numTokenInLocker +=
                  pathSquares[temp + dieValue].numTokensPlayer[m];
               pathSquares[temp + dieValue].numTokensPlayer[m] = 0;
               hasKilled = true;
            }
         }

         //if they reach thier home place they win
         if (temp + dieValue == scaleNum(pathLength - 1, whoseTurn)) {
            score[whoseTurn]++;
            hasHomed = true;
         } else {
            pathSquares[temp + dieValue].numTokensPlayer[whoseTurn]++;
         }

         pathSquares[i].numTokensPlayer[whoseTurn]--;
         hasMoved = true;
         canRoll = true;
      }
   }
   //drawing the changes to the canvas
   drawToCvs();
   trackTokens();
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
