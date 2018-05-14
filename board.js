let board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
let count = 0;
winner = "null";

exports.resetBoard = () => {
  board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
  winner = "null";
  count = 0;
};
exports.display = callback => {
  let output = "\n";

  for (i = 0; i < board.length; i++) {
    output += board[i];
    output += "  ";
    if ((i + 1) % 3 == 0) output += "\n";
  }
  callback(output);
};

exports.move = (player, pos) => {
  if (winner != "null") {
    return `player ${winner} already won`;
  } else if (count >= 9 && winner == "null") {
    return "it's a draw";
  } else if (board[pos - 1] != ".") {
    return "invalid move";
  } else {
    board[pos - 1] = player == "X" ? "X" : "O";
    count++;
    if (userWon()) {
      winner = player;
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
    ((board[0] == board[1] && board[1] == board[2] && board[0] != ".") ||
      (board[3] == board[4] && board[4] == board[5] && board[3] != ".") ||
      (board[6] == board[7] && board[7] == board[8] && board[6] != ".")) ||

    // vertical
    ((board[0] == board[3] && board[3] == board[6] && board[0] != ".") ||
      (board[1] == board[4] && board[4] == board[7] && board[1] != ".") ||
      (board[2] == board[5] && board[5] == board[8] && board[2] != ".")) ||

    // diagonal
    ((board[0] == board[4] && board[4] == board[8] && board[0] != ".") ||
      (board[2] == board[4] && board[4] == board[6] && board[2] != "."))
  ) {
    return true;
  }
  return false;
};
