var board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
var count = 0;
winner = "null";
// var Board = function() {
//   this.board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
//   this.count = 0;
//   this.winner = "null";
//   return this;
// };

exports.reset = () => {
  board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
  winner = "null";
  count = 0;
};
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

exports.move = (player, pos) => {
  //   var _this = this;
  //   var board = _this.board;
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

hasWon = () => {
  //var _this = this;
  var win = false;
  var c = board;
  if (
    (c[0] == c[1] && c[1] == c[2] && c[0] != ".") ||
    (c[3] == c[4] && c[4] == c[5] && c[3] != ".") ||
    (c[6] == c[7] && c[7] == c[8] && c[6] != ".")
  ) {
    win = true;
  } else if (
    (c[0] == c[3] && c[3] == c[6] && c[0] != ".") ||
    (c[1] == c[4] && c[4] == c[7] && c[1] != ".") ||
    (c[2] == c[5] && c[5] == c[8] && c[2] != ".")
  ) {
    win = true;
  } else if (
    (c[0] == c[4] && c[4] == c[8] && c[0] != ".") ||
    (c[2] == c[4] && c[4] == c[6] && c[2] != ".")
  ) {
    win = true;
  }
  return win;
};
