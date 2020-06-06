// const isThereAMove = () => {
//    console.log("///////////////////////");
//    if (
//       dieValue != 6 &&
//       gamePlay[whoseTurn].numTokenInLocker == numTokens - score[whoseTurn]
//    )
//       console.log("There is no move.");
//    else {
//       if (
//          numTokens - score[whoseTurn] - gamePlay[whoseTurn].numTokenInLocker >
//          0
//       ) {
//          for (let z = 0; z < numTokens; z++) {
//             if (gamePlay[whoseTurn].tokensPositions[z] >= 0) {
//                if (
//                   gamePlay[whoseTurn].tokensPositions[z] + dieValue ==
//                   scaleNum(pathLength - 1, whoseTurn)
//                ) {
//                   console.log("There is a move. Congratulations!");
//                } else if (
//                   gamePlay[whoseTurn].tokensPositions[z] + dieValue >
//                   scaleNum(pathLength - 1, whoseTurn)
//                ) {
//                   console.log("There is no move. Need an exact value.!");
//                } else
//                   for (let l = 0; l < numTokens; l++) {
//                      if (
//                         gamePlay[whoseTurn].tokensPositions[z] + dieValue ==
//                            gamePlay[whoseTurn].tokensPositions[l] &&
//                         l != z
//                      ) {
//                         console.log(
//                            "there is no move. Duplicating not possible."
//                         );
//                      } else console.log("There is a move. Congratulations!");
//                   }
//             }
//          }
//       } else console.log("There is a move. Congratulations!");
//    }
// };

// function isThereAMove() {
//    if (dieValue != 6 && gamePlay[whoseTurn].numTokenInLocker == numTokens - score[whoseTurn]) {
//       console.log("No token to move.");
//    }
//    else {
//       let condition = 0;
//       for (let i = 0; i < numTokens; i++){
//          if (gamePlay[whoseTurn].tokensPositions[i] > 0) {
//             for (let j = 0; j < numTokens; j++){

//             }
//          }
//       }
//    }
// }

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

//number is 6 => no switch
//has killed => no switch
//has homed => no switch
// num!=6 && !haskilled && !hashomed

//has moved then only roll die
//not 6 and   has not moved but also no coin to move- also can roll die