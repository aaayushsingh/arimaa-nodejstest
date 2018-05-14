var board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
var count = 0;
winner = "null";

var Board = function(_super) {
  function Board() {
    var board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
    var count = 0;
    winner = "null";
  }

  Board.prototype.display = () => {
    var output = "\n";

    for (c = 0; c < board.length; c++) {
      output += board[c];
      output += "  ";
      if ((c + 1) % 3 == 0) output += "\n";
    }
    return output;
  };

  Board.prototype.reset = () => {
    board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
    count = 0;
    winner = "null";
  };

  Board.prototype.move = (player, pos) => {
    if (winner != "null") {
      return `player ${winner} already won`;
    } else if (count >= 9 && winner == "null") {
      return "it's a draw";
    } else if (board[pos - 1] != ".") {
      return "invalid move";
    } else {
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

  return Board;
};
exports.Board = Board;
