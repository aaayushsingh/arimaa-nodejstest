let board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
let count = 0;

resetBoard = () => {
  board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
  count = 0;
};

display = cb => {
  var output = "\n";

  for (c = 0; c < board.length; c++) {
    output += board[c];
    output += "  ";
    if ((c + 1) % 3 == 0) output += "\n";
  }
  cb(output);
};

move = (player, pos) => {
  if (count >= 9 && winner == "null") {
    return "it's a draw";
  } else if (board[pos - 1] != ".") {
    return "That place is already filled!";
  } else {
    board[pos - 1] = player == "X" ? "X" : "O";
    count++;
    if (userWon()) {
      return `player ${player} won the game`;
    } else if (count >= 9) {
      return "Draw!!! Play again to win..";
    } else {
      return "";
    }
  }
};

userWon = () => {
  if (
    // horizontal
    (board[0] == board[1] && board[1] == board[2] && board[0] != ".") ||
    (board[3] == board[4] && board[4] == board[5] && board[3] != ".") ||
    (board[6] == board[7] && board[7] == board[8] && board[6] != ".") ||
    // vertical
    (board[0] == board[3] && board[3] == board[6] && board[0] != ".") ||
    (board[1] == board[4] && board[4] == board[7] && board[1] != ".") ||
    (board[2] == board[5] && board[5] == board[8] && board[2] != ".") ||
    // diagonal
    (board[0] == board[4] && board[4] == board[8] && board[0] != ".") ||
    (board[2] == board[4] && board[4] == board[6] && board[2] != ".")
  ) {
    return true;
  }
  return false;
};

module.exports = {
  resetBoard,
  move,
  display
};
