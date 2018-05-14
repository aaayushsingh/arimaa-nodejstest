var board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
var count = 0;
winner = "null";

//resets the board
exports.reset = () => {
  board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
  winner = "null";
  count = 0;
};

// prints the current board
exports.display = cb => {
  var output = "\n";

  for (c = 0; c < board.length; c++) {
    output += board[c];
    output += "  ";
    if ((c + 1) % 3 == 0) output += "\n";
  }
  cb(output);
};

// 0 1 2
// 3 4 5
// 6 7 8

// takes 2 arguments, the active player and the position the player wants to move
exports.move = (player, pos) => {
  //check if we already have a winner
  if (winner != "null") {
    return `player ${winner} already won`;
  } // if 9 moves already over, it means it's a draw
  else if (count >= 9 && winner == "null") {
    return "it's a draw";
  } // if the position that the player is trying to move is already filled, return invalid move
  else if (board[pos - 1] != ".") {
    return "invalid move";
  } // else, make the move if everything is good
  else {
    board[pos - 1] = player == "X" ? "X" : "O";
    count++;
    if (hasWon()) {
      winner = player;
      return `player ${player} won`;
    } else if (count >= 9) {
      return "it's a draw";
    } else {
      return "";
    }
  }
};

hasWon = () => {
  // check is one of the users won the game after the last move
  // return true if we have a winner, else return false.
  var c = board;
  if (
    (c[0] == c[1] && c[1] == c[2] && c[0] != ".") ||
    (c[3] == c[4] && c[4] == c[5] && c[3] != ".") ||
    (c[6] == c[7] && c[7] == c[8] && c[6] != ".")
  ) {
    return true;
  } else if (
    (c[0] == c[3] && c[3] == c[6] && c[0] != ".") ||
    (c[1] == c[4] && c[4] == c[7] && c[1] != ".") ||
    (c[2] == c[5] && c[5] == c[8] && c[2] != ".")
  ) {
    return true;
  } else if (
    (c[0] == c[4] && c[4] == c[8] && c[0] != ".") ||
    (c[2] == c[4] && c[4] == c[6] && c[2] != ".")
  ) {
    return true;
  }
  return false;
};
