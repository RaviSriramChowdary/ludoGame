// Canvas Implementation of ther game
const cvs = document.getElementById("gameCanvas");
const cvsHolder = document.getElementById("canvasHolder");
const ctx = cvs.getContext("2d");
cvs.width = 720;
cvs.height = cvs.width;
let scale = 1;
window.addEventListener("resize", function () {
   if (document.body.offsetWidth < 724) {
      scale = document.body.offsetWidth / cvs.offsetWidth;
      cvsHolder.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
      document.getElementById("numberinput").style.paddingTop =
         document.body.offsetHeight / 2 -
         cvs.height * scale * 0.45 -
         140 +
         "px";
   } else if (document.body.offsetWidth >= 724) {
      scale = 1;
      cvsHolder.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
      document.getElementById("numberinput").style.paddingTop =
         document.body.offsetHeight / 2 -
         cvs.height * scale * 0.45 -
         140 +
         "px";
   }
});
if (document.body.offsetWidth < 724) {
   scale = document.body.offsetWidth / cvs.offsetWidth;
   cvsHolder.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
   document.getElementById("numberinput").style.paddingTop =
      document.body.offsetHeight / 2 - cvs.height * scale * 0.45 - 140 + "px";
}

// document.getElementById("numberinput").style.paddingTop =
//    document.body.offsetHeight / 2 - cvs.height * scale * 0.45 - 80 + "px";

cvsHolder.style.width = cvs.offsetWidth + "px";

let hasRolled,
   hasMoved,
   canRoll,
   hasKilled,
   hasHomed,
   canMove,
   onlyOnemove = { value: 0, positionCanBeMoved: null };

hasRolled = false;
hasMoved = false;
canRoll = true;
hasKilled = false;
hasHomed = false;

let possibleMoves = new Array();

let whoseTurn;
let dieValue = 0;

let numPlayers;
let gameOrder;
// gameOrder = [1, 4];
let numTokens;
let situation = document.getElementById("presentsituation");

let names;

let numSquares = 15;
let pathLength = 4 * numSquares - 4;

let gamePlay;
let gamePath = new Array();
let pathSquares = new Array();

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
   ctx.clearRect(0, 0, cvs.width, cvs.height);

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
      if (pathSquares[i].isSafeSquare) {
         ctx.beginPath();
         ctx.moveTo(gamePath[i].x + unit / 2, gamePath[i].y + unit / 4);
         ctx.lineTo(gamePath[i].x + (3 * unit) / 4, gamePath[i].y + unit / 2);
         ctx.lineTo(gamePath[i].x + unit / 2, gamePath[i].y + (3 * unit) / 4);
         ctx.lineTo(gamePath[i].x + unit / 4, gamePath[i].y + unit / 2);
         ctx.lineTo(gamePath[i].x + unit / 2, gamePath[i].y + unit / 4);
         ctx.stroke();
      }
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
      for (let j = 1; j <=4; j++) {
         if (pathSquares[i].numTokensPlayer[j] > 0) {
            if (pathSquares[i].isSafeSquare) {
               for (let l = 0; l < pathSquares[i].numTokensPlayer[j]; l++) {
                  if (j == 1) {
                     drawToken(
                        gamePath[i].x + unit / 4 + (l * unit) / 8,
                        gamePath[i].y + unit / 4,
                        colors[j],
                        3 / 4
                     );
                  } else if (j == 2) {
                     drawToken(
                        gamePath[i].x + (3 * unit) / 4,
                        gamePath[i].y + unit / 4 + (l * unit) / 8,
                        colors[j],
                        3 / 4
                     );
                  } else if (j == 3) {
                     drawToken(
                        gamePath[i].x + (3 * unit) / 4 - (l * unit) / 8,
                        gamePath[i].y + (3 * unit) / 4,
                        colors[j],
                        3 / 4
                     );
                  } else if (j == 4) {
                     drawToken(
                        gamePath[i].x + unit / 4,
                        gamePath[i].y + (3 * unit) / 4 - (l * unit) / 8,
                        colors[j],
                        3 / 4
                     );
                  }
               }
            } else {
               for (let l = 0; l < pathSquares[i].numTokensPlayer[j]; l++) {
                  drawToken(
                     gamePath[i].x + unit / 2 + (l * unit) / 8,
                     gamePath[i].y + unit / 2,
                     colors[j],
                     1
                  );
               }
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
   ctx.lineWidth = 1;
   for (let k = 0; k < numPlayers; k++) {
      ctx.fillText(
         names[[gameOrder[k]]],
         lockers[[gameOrder[k]]].x + 50,
         lockers[[gameOrder[k]]].y - 5
      );
      ctx.fillText(
         score[[gameOrder[k]]],
         lockers[[gameOrder[k]]].x + lockWidth / 2 + 25,
         lockers[[gameOrder[k]]].y + lockWidth / 2 + 8
      );
      ctx.fillStyle = "black";
      ctx.fillRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2 - 12,
         lockers[[gameOrder[k]]].y + lockWidth / 2 - 12,
         12,
         12
      );
      ctx.strokeRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2 - 12,
         lockers[[gameOrder[k]]].y + lockWidth / 2 - 12,
         12,
         12
      );
      ctx.fillStyle = "white";
      ctx.fillRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2,
         lockers[[gameOrder[k]]].y + lockWidth / 2 - 12,
         12,
         12
      );
      ctx.strokeRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2,
         lockers[[gameOrder[k]]].y + lockWidth / 2 - 12,
         12,
         12
      );
      ctx.fillStyle = "white";
      ctx.fillRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2 - 12,
         lockers[[gameOrder[k]]].y + lockWidth / 2,
         12,
         12
      );
      ctx.strokeRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2 - 12,
         lockers[[gameOrder[k]]].y + lockWidth / 2,
         12,
         12
      );
      ctx.fillStyle = "black";
      ctx.fillRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2,
         lockers[[gameOrder[k]]].y + lockWidth / 2,
         12,
         12
      );
      ctx.strokeRect(
         lockers[[gameOrder[k]]].x + lockWidth / 2,
         lockers[[gameOrder[k]]].y + lockWidth / 2,
         12,
         12
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
      });
      if (counter > 0)
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
   for (let i = 1; i <= 4; i++) {
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

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 0.9));

document.getElementById("incPlayers").addEventListener("click", function () {
   numPlayers = parseInt(document.getElementById("numPlayers").value);
   if (numPlayers < 4)
      document.getElementById("numPlayers").value =
         parseInt(document.getElementById("numPlayers").value) + 1;
});

document.getElementById("decPlayers").addEventListener("click", function () {
   numPlayers = parseInt(document.getElementById("numPlayers").value);
   if (numPlayers > 2)
      document.getElementById("numPlayers").value =
         parseInt(document.getElementById("numPlayers").value) - 1;
});

document.getElementById("incTokens").addEventListener("click", function () {
   numTokens = parseInt(document.getElementById("numTokens").value);
   if (numTokens < 4)
      document.getElementById("numTokens").value =
         parseInt(document.getElementById("numTokens").value) + 1;
});

document.getElementById("decTokens").addEventListener("click", function () {
   numTokens = parseInt(document.getElementById("numTokens").value);
   if (numTokens > 2)
      document.getElementById("numTokens").value =
         parseInt(document.getElementById("numTokens").value) - 1;
});

document.getElementById("rulesbtn").addEventListener("click", function () {
   document.getElementById("welcome").style.display = "none";
   document.getElementById("rules").style.display = "block";
});
document.getElementById("simpleLudo").addEventListener("click", function () {
   document.getElementById("welcome").style.display = "none";
   document.getElementById("selectorColor").style.display = "block";
   numPlayers = parseInt(document.getElementById("numPlayers").value);
   players = document.getElementsByClassName("orderselector");
   for (let i = 0; i < 4; i++) {
      players[i].style.display = "none";
   }
   for (let i = 0; i < numPlayers; i++) {
      players[i].style.display = "block";
   }
   if (numPlayers <= 2) {
      document.getElementsByClassName("colorInput")[0].value = 1;
      document.getElementsByClassName("colorInput")[1].value = 3;
      document.getElementsByClassName("colorInput")[1].disabled = true;
   } else {
      document.getElementsByClassName("colorInput")[0].value = 1;
      document.getElementsByClassName("colorInput")[1].value = 2;
      document.getElementsByClassName("colorInput")[1].disabled = false;
   }
});

document.getElementById("player1").addEventListener("change", function (e) {
   if (numPlayers <= 2) {
      let value = parseInt(e.target.value);
      let newValue;
      if (value <= 2) {
         newValue = value + 2;
         document.getElementsByClassName("colorInput")[1].value = newValue;
      } else {
         newValue = value - 2;
         document.getElementsByClassName("colorInput")[1].value = newValue;
      }
   }
});

document.getElementById("startGame").addEventListener("click", function () {
   names = new Array(5);
   gameOrder = new Array();
   let errorCounter = 0;
   if (numPlayers > 2) {
      for (let i = 0; i < numPlayers; i++) {
         gameOrder.forEach((value, index) => {
            if (
               value ==
               parseInt(document.getElementsByClassName("colorInput")[i].value)
            )
               errorCounter++;
         });
         if (errorCounter == 0)
            gameOrder.push(
               parseInt(document.getElementsByClassName("colorInput")[i].value)
            );
         else {
            alert("Enter Different colors.");
            return;
         }
      }
   } else {
      gameOrder[0] = parseInt(
         document.getElementsByClassName("colorInput")[0].value
      );
      gameOrder[1] = parseInt(
         document.getElementsByClassName("colorInput")[1].value
      );
   }
   for (let i = 0; i <= 4; i++) {
      names[i] = null;
   }
   for (let i = 0; i < numPlayers; i++) {
      names[
         document.getElementsByClassName("colorInput")[i].value
      ] = document.getElementsByClassName("name")[i].value;
   }
   gameOrder.sort();
   //console.log(gameOrder);
   whoseTurn = gameOrder[0];
   document.getElementById("dieHolder").style.backgroundColor =
      colors[whoseTurn] + "aa";
   document.getElementById("selectorColor").style.display = "none";
   numTokens = parseInt(document.getElementById("numTokens").value);
   gamePlay = new Array(numPlayers + 1);
   situation.innerHTML = names[gameOrder[0]] + " has to roll the die.<br/>";
   defineGamePlay();
   definePath();
   drawToCvs();
});

document.getElementById("restart").addEventListener("click", function () {
   location.reload();
});

document.getElementById("back").addEventListener("click", function () {
   document.getElementById("welcome").style.display = "block";
   document.getElementById("selectorColor").style.display = "none";
});

document.getElementById("backfromrules").addEventListener("click", function () {
   document.getElementById("welcome").style.display = "block";
   document.getElementById("rules").style.display = "none";
});

let hasalreadySwitched = false;
let onemovethereanditisdone = false;

function rollDie() {
   situation.innerHTML = "Rolling...";
   onemovethereanditisdone = false;
   hasRolled = true;
   hasalreadySwitched = false;
   canRoll = false;
   hasMoved = false;
   if (document.getElementById("rollorin").checked) dieValue = rand(1, 6);
   else dieValue = parseInt(document.getElementById("inValue").value);
   resetClicks();
   isOnetokenPresent();
   if (onlyOnemove.value == 1) {
      onemovethereanditisdone = true;
      if (onlyOnemove.positionCanBeMoved != -1) {
         clickedX = pathSquares[onlyOnemove.positionCanBeMoved].x + unit / 2;
         clickedY = pathSquares[onlyOnemove.positionCanBeMoved].y + unit / 2;
      } else if (onlyOnemove.positionCanBeMoved == -1) {
         clickedX = lockers[whoseTurn].x + lockWidth / 2;
         clickedY = lockers[whoseTurn].y + lockWidth / 2;
      }
      setTimeout(function () {
         situation.innerHTML = names[whoseTurn] + ": Move automated <br/>";
         updateGame();
      }, 3200);
   } else {
      setTimeout(function () {
         isThereAMove();
         if (canMove)
            situation.innerHTML =
               names[whoseTurn] + ": has to move their token. <br/>";
      }, 3200);
   }
   setTimeout(function () {
      drawToCvs();
   }, 3200 + (dieValue + 1) * 150);
}

function switchPlayer() {
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

   document.getElementById("dieHolder").style.backgroundColor =
      colors[whoseTurn] + "70";
   hasRolled = false;
   situation.innerHTML += names[whoseTurn] + ": has to roll the die. <br/>";
}

function updateGame() {
   //console.log("Came to the updating of game.");
   hasKilled = false;
   hasHomed = false;

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
      hasRolled &&
      gamePlay[whoseTurn].numTokenInLocker > 0
   ) {
      gamePlay[whoseTurn].numTokenInLocker--;
      pathSquares[scaleNum(0, whoseTurn)].numTokensPlayer[whoseTurn]++;
      hasMoved = true;
      canRoll = true;
      //console.log("Freed the token.");
      situation.innerHTML = names[whoseTurn] + ": has to roll the die. <br/>";
   }

   trackTokens();
   drawToCvs();

   //if the token is in other square updating it:

   for (let i = 0; i < pathLength; i++) {
      if (
         hasClickedon(pathSquares[i].x, pathSquares[i].y, unit, unit) &&
         hasMoved == false &&
         hasRolled &&
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
               pathSquares[temp + dieValue].numTokensPlayer[m] > 0 &&
               !pathSquares[temp + dieValue].isSafeSquare
            ) {
               setTimeout(function () {
                  "Came to the killing time out section.";
                  gamePlay[m].numTokenInLocker +=
                     pathSquares[temp + dieValue].numTokensPlayer[m];
                  pathSquares[temp + dieValue].numTokensPlayer[m] = 0;
                  hasKilled = true;
               }, dieValue * 150);
            }
            if (
               m == whoseTurn &&
               pathSquares[temp + dieValue].numTokensPlayer[m] > 0 &&
               !pathSquares[temp + dieValue].isSafeSquare
            ) {
               counter++;
            }
         }

         if (counter > 0) break;

         //if they reach thier home place they score
         let g = -1;
         let m = -1;
         if (temp + dieValue == scaleNum(pathLength - 1, whoseTurn)) {
            m = 0;
            let scoregame = setInterval(function () {
               //console.log("Going to the success.");
               if (temp + m < 0)
                  pathSquares[temp + gamePath.length + g].numTokensPlayer[
                     whoseTurn
                  ]--;
               else {
                  pathSquares[temp + m].numTokensPlayer[whoseTurn]--;
               }
               if (temp + m + 1 < 0)
                  pathSquares[temp + gamePath.length + m + 1].numTokensPlayer[
                     whoseTurn
                  ]++;
               else {
                  pathSquares[temp + m + 1].numTokensPlayer[whoseTurn]++;
               }
               if (dieValue == m + 1) {
                  pathSquares[temp + m + 1].numTokensPlayer[whoseTurn]--;
                  score[whoseTurn]++;
                  hasHomed = true;
                  clearInterval(scoregame);
                  hasMoved = true;
                  canRoll = true;
                  isThereAMove();
                  if (score[whoseTurn] == numTokens) {
                     winOrder.push(whoseTurn);
                     let place;
                     gameOrder.forEach((value, index) => {
                        if (value == whoseTurn) {
                           place = index;
                        }
                     });
                     situation.innerHTML +=
                        names[whoseTurn] +
                        " has won position " +
                        winOrder.length;
                     switchPlayer();
                     gameOrder.splice(place, 1);
                     numPlayers--;
                     hasalreadySwitched = true;

                     if (numPlayers <= 1) {
                        winOrder.push(whoseTurn);
                        document.getElementById("scorecard").innerHTML =
                           "<h1>Score Card</h1>" + "<ul>";
                        for (let i = 0; i < winOrder.length; i++) {
                           document.getElementById("scorecard").innerHTML +=
                              "<li>" +
                              "Position " +
                              (i + 1) +
                              ".&emsp;" +
                              names[winOrder[i]] +
                              "</li>";
                           if (i == winOrder.length - 1)
                              document.getElementById("scorecard").innerHTML +=
                                 "</ul>" +
                                 "<button class='playagain' id='playagain'>Play Again</button>";
                        }
                        document.getElementById("scorebackdrop").style.display =
                           "flex";
                        document
                           .getElementById("playagain")
                           .addEventListener("click", function () {
                              location.reload();
                           });
                     }
                  }
               }
               m++;
               trackTokens();
               drawToCvs();
            }, 150);
         } else {
            g = 0;
            // pathSquares[temp + dieValue].numTokensPlayer[whoseTurn]++;
            let game = setInterval(function () {
               //console.log("On the way to the nest position.");
               if (temp + g < 0)
                  pathSquares[temp + gamePath.length + g].numTokensPlayer[
                     whoseTurn
                  ]--;
               else {
                  pathSquares[temp + g].numTokensPlayer[whoseTurn]--;
               }
               if (temp + g + 1 < 0)
                  pathSquares[temp + gamePath.length + g + 1].numTokensPlayer[
                     whoseTurn
                  ]++;
               else {
                  pathSquares[temp + g + 1].numTokensPlayer[whoseTurn]++;
               }
               trackTokens();
               drawToCvs();
               if (dieValue == g + 1) {
                  clearInterval(game);
                  hasMoved = true;
                  canRoll = true;
                  isThereAMove();
                  if (score[whoseTurn] == numTokens) {
                     winOrder.push(whoseTurn);
                     let place;
                     gameOrder.forEach((value, index) => {
                        if (value == whoseTurn) {
                           place = index;
                        }
                     });
                     situation.innerHTML +=
                        names[whoseTurn] +
                        " has won position " +
                        winOrder.length;
                     switchPlayer();
                     gameOrder.splice(place, 1);
                     numPlayers--;
                     hasalreadySwitched = true;

                     if (numPlayers <= 1) {
                        winOrder.push(whoseTurn);
                        document.getElementById("scorecard").innerHTML =
                           "<h1>Score Card</h1>" + "<ul>";
                        for (let i = 0; i < winOrder.length; i++) {
                           //console.log(names[winOrder[i]]);
                           document.getElementById("scorecard").innerHTML +=
                              "<li>" +
                              "Position " +
                              (i + 1) +
                              ".&emsp;" +
                              names[winOrder[i]] +
                              "</li>";
                           if (i == winOrder.length - 1)
                              document.getElementById("scorecard").innerHTML +=
                                 "</ul>" +
                                 "<button class='playagain' id='playagain'>Play Again</button>";
                        }
                        document.getElementById("scorebackdrop").style.display =
                           "flex";
                        document
                           .getElementById("playagain")
                           .addEventListener("click", function () {
                              location.reload();
                           });
                     }
                  } else if (
                     (hasMoved || !canMove) &&
                     !hasKilled &&
                     !hasHomed &&
                     dieValue != 6 &&
                     !hasalreadySwitched
                  ) {
                     switchPlayer();
                     hasalreadySwitched = true;
                  } else {
                     situation.innerHTML =
                        names[whoseTurn] + ": has to roll the die. <br/>";
                  }
                  trackTokens();
                  drawToCvs();
               }

               g++;
            }, 150);
         }
      }
   }

   //drawing the changes to the canvas
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
   } else if (dieValue == 6 && gamePlay[whoseTurn].numTokenInLocker > 0) {
      canMove = true;
   } else {
      let canMoveConditionCounter = 0;

      //if the token is in other square updating it:

      for (let i = 0; i < numTokens; i++) {
         if (gamePlay[whoseTurn].tokensPositions[i] >= 0) {
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
               if (
                  temp + dieValue == gamePlay[whoseTurn].tokensPositions[j] &&
                  !pathSquares[temp + dieValue].isSafeSquare
               ) {
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
   isOnetokenPresent();
}

function isOnetokenPresent() {
   possibleMoves = new Array();
   // re setting the onlyOnemove variable
   onlyOnemove.value = 0;
   onlyOnemove.positionCanBeMoved = null;

   //Conditions checking if only one move is possible

   //If there are some tokens inside the locker and the die rolled 6 then taking all the locked tokens move to be 1
   if (dieValue == 6 && gamePlay[whoseTurn].numTokenInLocker > 0) {
      onlyOnemove.value = 1;
      onlyOnemove.positionCanBeMoved = -1;
      possibleMoves.push(-1);
   }

   //and then we have to go to the tokens that are not inside the locker

   let onemoveConditionCounter = 0;
   let posvar = null;

   for (let i = 0; i < numTokens; i++) {
      if (gamePlay[whoseTurn].tokensPositions[i] >= 0) {
         posvar = gamePlay[whoseTurn].tokensPositions[i];
         //condition for a free token
         let insideCounter = 0;
         let temp = gamePlay[whoseTurn].tokensPositions[i];
         if (temp + dieValue > pathLength - 1) {
            temp -= pathLength;
         }
         //Should not pass their barriers
         if (
            temp < scaleNum(0, whoseTurn) &&
            temp + dieValue >= scaleNum(0, whoseTurn)
         ) {
            insideCounter++;
         }
         //should not duplicate unless it is a safe square
         for (let j = 0; j < numTokens; j++) {
            if (
               temp + dieValue == gamePlay[whoseTurn].tokensPositions[j] &&
               !pathSquares[temp + dieValue].isSafeSquare
            ) {
               insideCounter++;
            }
         }
         if (insideCounter > 0) {
            onemoveConditionCounter++;
         }

         if (insideCounter == 0) {
            //The token can be moved
            if (onlyOnemove.value == 0) {
               //Still no token found
               //then
               onlyOnemove.value++;
               onlyOnemove.positionCanBeMoved = posvar;
               possibleMoves.push(posvar);
            } else if (onlyOnemove.value > 0) {
               //Already a token found
               //then checking if it has been in the same caught position
               if (posvar != onlyOnemove.positionCanBeMoved) {
                  onlyOnemove.value++;
                  possibleMoves.push(posvar);
               } else possibleMoves.push(posvar);
            }
         }
      }
   }
}

const hasClickedon = (x, y, w, h) =>
   clickedX > x && clickedX < x + w && clickedY > y && clickedY < y + h;

cvs.addEventListener("click", touchPositionDetect, false);
cvs.addEventListener("touchstart", touchPositionDetect, false);

function touchPositionDetect(event) {
   let rect = cvs.getBoundingClientRect();
   //console.log("Client X: " + event.clientX + "Client Y: " + event.clientY);
   let x = event.clientX - rect.left;
   let y = event.clientY - rect.top;
   clickedX = x / scale;
   clickedY = y / scale;
   updateGame();
}
