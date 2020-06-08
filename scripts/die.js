// function rollDice() {
//    let dice = document.getElementById("frd");
//    rollDie();
//    rollNum = dieValue;
//    toggleClasses(dice);
// }
let evenorodd;

function toggleClasses(die) {
   if (document.getElementById("die").classList[0] == "even") evenorodd = 2;
   else evenorodd = 1;

   document.getElementById("die").classList.toggle("even");
   document.getElementById("die").classList.toggle("odd");

   die.classList = ["faceRelDiv"];
   if (rollNum == 1) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto1");
      else die.setAttribute("class", die.getAttribute("class") + " goto7");
   }
   if (rollNum == 2) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto2");
      else die.setAttribute("class", die.getAttribute("class") + " goto8");
   }
   if (rollNum == 3) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto3");
      else die.setAttribute("class", die.getAttribute("class") + " goto9");
   }
   if (rollNum == 4) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto4");
      else die.setAttribute("class", die.getAttribute("class") + " goto10");
   }
   if (rollNum == 5) {
      if (evenorodd == 2)
         die.setAttribute("class", die.getAttribute("class") + " goto5");
      else die.setAttribute("class", die.getAttribute("class") + " goto11");
   }
   if (rollNum == 6) {
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

document.getElementById("testBtn").addEventListener(
   "click",

   function () {
      document.getElementById("rollorin").checked = false;
      let dice = document.getElementById("frd");
      if (whoseTurn != 0) isThereAMove();
      if (canRoll) {
         rollDie();
         isThereAMove();
         if (!canMove) {
            setTimeout(function () {
               if (!onemovethereanditisdone) {
                  situation.innerHTML =
                     names[whoseTurn] + " has no tokens to move. <br/>";
                  switchPlayer();
                  drawToCvs();
               }
            }, 3200);
            canRoll = true;
         }
         document.getElementById("coverForDie").style.display = "block";
         document.getElementById("testBtn").disabled = true;
         cvs.removeEventListener("click", touchPositionDetect, false);
         cvs.removeEventListener("touchstart", touchPositionDetect, false);
         rollNum = dieValue;
         toggleClasses(dice);
         setTimeout(function () {
            document.getElementById("coverForDie").style.display = "none";
            document.getElementById("testBtn").disabled = false;
            cvs.addEventListener("click", touchPositionDetect, false);
            cvs.addEventListener("touchstart", touchPositionDetect, false);
         }, 3200);
      } else {
         isThereAMove();
         if (!canMove) {
            rollDie();
            setTimeout(function () {
               if (!onemovethereanditisdone) {
                  situation.innerHTML =
                     names[whoseTurn] + " has no tokens to move. <br/>";
                  switchPlayer();
                  drawToCvs();
               }
            }, 3200);
            document.getElementById("coverForDie").style.display = "block";
            document.getElementById("testBtn").disabled = true;
            cvs.removeEventListener("click", touchPositionDetect, false);
            cvs.removeEventListener("touchstart", touchPositionDetect, false);
            rollNum = dieValue;
            toggleClasses(dice);
            setTimeout(function () {
               document.getElementById("coverForDie").style.display = "none";
               document.getElementById("testBtn").disabled = false;
               cvs.addEventListener("click", touchPositionDetect, false);
               cvs.addEventListener("touchstart", touchPositionDetect, false);
            }, 3200);
            canRoll = true;
         }
      }
   },
   false
);

document.getElementById("dieHolder").addEventListener(
   "click",
   function () {
      document.getElementById("rollorin").checked = true;
      let dice = document.getElementById("frd");
      if (whoseTurn != 0) isThereAMove();
      if (canRoll) {
         rollDie();
         isThereAMove();
         if (!canMove) {
            setTimeout(function () {
               if (!onemovethereanditisdone) {
                  situation.innerHTML =
                     names[whoseTurn] + " has no tokens to move. <br/>";
                  switchPlayer();
                  drawToCvs();
               }
            }, 3200);
            canRoll = true;
         }
         document.getElementById("coverForDie").style.display = "block";
         document.getElementById("testBtn").disabled = true;
         cvs.removeEventListener("click", touchPositionDetect, false);
         cvs.removeEventListener("touchstart", touchPositionDetect, false);
         rollNum = dieValue;
         toggleClasses(dice);
         setTimeout(function () {
            document.getElementById("coverForDie").style.display = "none";
            document.getElementById("testBtn").disabled = false;
            cvs.addEventListener("click", touchPositionDetect, false);
            cvs.addEventListener("touchstart", touchPositionDetect, false);
         }, 3200);
      } else {
         isThereAMove();
         if (!canMove) {
            rollDie();
            setTimeout(function () {
               if (!onemovethereanditisdone) {
                  situation.innerHTML =
                     names[whoseTurn] + " has no tokens to move. <br/>";
                  switchPlayer();
                  drawToCvs();
               }
            }, 3200);
            document.getElementById("coverForDie").style.display = "block";
            document.getElementById("testBtn").disabled = true;
            cvs.removeEventListener("click", touchPositionDetect, false);
            cvs.removeEventListener("touchstart", touchPositionDetect, false);
            rollNum = dieValue;
            toggleClasses(dice);
            setTimeout(function () {
               document.getElementById("coverForDie").style.display = "none";
               document.getElementById("testBtn").disabled = false;
               cvs.addEventListener("click", touchPositionDetect, false);
               cvs.addEventListener("touchstart", touchPositionDetect, false);
            }, 3200);
            canRoll = true;
         }
      }
   },
   false
);
