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

document.getElementById("dieHolder").addEventListener(
   "click",
   function () {
      let dice = document.getElementById("frd");
      if (whoseTurn != 0) isThereAMove();
      if (canRoll) {
         rollDie();
         document.getElementById("coverForDie").style.display = "block";
         rollNum = dieValue;
         toggleClasses(dice);
         setTimeout(function () {
            document.getElementById("coverForDie").style.display = "none";
         },3000);
      } else {
         if (!canMove) {
         rollDie();
         document.getElementById("coverForDie").style.display = "block";
         rollNum = dieValue;
         toggleClasses(dice);
         setTimeout(function () {
            document.getElementById("coverForDie").style.display = "none";
         },3000);
         }
      }
   },
   false
);
