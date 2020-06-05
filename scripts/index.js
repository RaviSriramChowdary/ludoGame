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

let numPlayers = document.getElementById("numPlayers").value;
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
      if (pathSquares[i].isSafeSquare) console.log(i);
   }
};

const addNext = (x, y, array) => {
   array.push({ x: x, y: y });
};

//sample codes here:

let lockers = [
   { x: 2 * unit, y: 2 * unit },
   { x: 2 * unit, y: 2 * unit },
   { x: 7 * unit, y: 2 * unit },
   { x: 7 * unit, y: 7 * unit },
   { x: 2 * unit, y: 7 * unit },
];

const drawToCvs = () => {
   //Drawing the path
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, cvs.width, cvs.height);

   ctx.strokeStyle = "black";
   for (let i = 0; i < pathLength; i++) {
      ctx.fillStyle = "white";
      if (i == 0) ctx.fillStyle = "Red";
      if (i == numSquares - 1) ctx.fillStyle = "green";
      if (i == 2 * numSquares - 2) ctx.fillStyle = "yellow";
      if (i == 3 * numSquares - 3) ctx.fillStyle = "cyan";
      ctx.fillRect(gamePath[i].x, gamePath[i].y, unit, unit);
      ctx.strokeRect(gamePath[i].x, gamePath[i].y, unit, unit);

      ctx.font = "18px Arial";
      ctx.fillStyle = "black";
      for (let j = 1; j < numTokens + 1; j++) {
         if (pathSquares[i].numTokensPlayer[j] > 0) {
            if (j == 1)
               ctx.fillText(
                  pathSquares[i].numTokensPlayer[j] + "R",
                  gamePath[i].x + 2,
                  gamePath[i].y + 22
               );
            if (j == 2)
               ctx.fillText(
                  pathSquares[i].numTokensPlayer[j] + "G",
                  gamePath[i].x + unit - 26,
                  gamePath[i].y + 22
               );
            if (j == 3)
               ctx.fillText(
                  pathSquares[i].numTokensPlayer[j] + "Y",
                  gamePath[i].x + 2,
                  gamePath[i].y + unit - 5
               );
            if (j == 4)
               ctx.fillText(
                  pathSquares[i].numTokensPlayer[j] + "B",
                  gamePath[i].x + unit - 24,
                  gamePath[i].y + unit - 5
               );
         }
      }
   }
   ctx.fillStyle = "red";
   ctx.fillRect(2 * unit, 2 * unit, 3 * unit, 3 * unit);
   ctx.strokeRect(2 * unit, 2 * unit, 3 * unit, 3 * unit);
   ctx.fillStyle = "green";
   ctx.fillRect(7 * unit, 2 * unit, 3 * unit, 3 * unit);
   ctx.strokeRect(7 * unit, 2 * unit, 3 * unit, 3 * unit);
   ctx.fillStyle = "yellow";
   ctx.fillRect(7 * unit, 7 * unit, 3 * unit, 3 * unit);
   ctx.strokeRect(7 * unit, 7 * unit, 3 * unit, 3 * unit);
   ctx.fillStyle = "cyan";
   ctx.fillRect(2 * unit, 7 * unit, 3 * unit, 3 * unit);
   ctx.strokeRect(2 * unit, 7 * unit, 3 * unit, 3 * unit);

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
      ctx.fillText(gamePlay[k].numTokenInLocker, lockers[k].x, lockers[k].y);
   }
   for (let k = 1; k <= numPlayers; k++) {
      ctx.fillText("Score: " + score[k], lockers[k].x + 30, lockers[k].y + 30);
   }
};

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
   console.log(result + " and corr is: " + corr);
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
      console.log("canRoll: " + canRoll);
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

document.getElementById('goNext').addEventListener('click', function () {
   document.getElementById("welcome").style.display = "none";
   document.getElementById('selectorColor').style.display = "block";
})

document.getElementById("startGame").addEventListener("click", function () {
   document.getElementById("selectorColor").style.display = "none";
});

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
         3 * unit,
         3 * unit
      ) &&
      hasMoved == false &&
      gamePlay[whoseTurn].numTokenInLocker > 0
   ) {
      console.log("dimpadu");
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
            if (m != whoseTurn && pathSquares[temp + dieValue].numTokensPlayer[m] > 0) {
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
