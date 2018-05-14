const app = require("express")();
const http = require("http").Server(app);
let port = 5050;

// socket
const io = require("socket.io")(http);
//board
const board = require("./board");
// global
let playerCounter = 0;
let users = [null, null];
let playerTurn = 0;
let won = false;

/* =================================================
    Socket Connection
==================================================*/
io.on("connection", socket => {
  // check no. of players connected
  if (playerCounter >= 2) {
    socket.emit(
      "conn",
      "One game is already in progress. Please try again later to join a new game."
    );
    socket.disconnect();
    // add player
  } else {
    playerCounter++;
    users[playerCounter - 1] = socket;
    if (playerCounter == 1) {
      io.emit("conn", `player ${playerCounter} connected... wait for player 2 `);
    }
    else {
      io.emit("conn", `player ${playerCounter} connected.`);
    }
  }
  // start game
  if (playerCounter == 2) {
    io.emit("message", "Start the game -- Player 1's turn");
    board.display(data => {
      io.emit("message", data);
    });
  }
  /* =====================================================
      player moves
  ======================================================*/
  socket.on("move", message => {
    if (won) {
      socket.emit("message", "Game Over! Type 'r' to exit");
    } else if (socket.id != users[playerTurn].id) {
      socket.emit("message", "wait for your turn");
    } else {
      let moveReturn = board.move(
        users[0].id == socket.id ? "X" : "O",
        message
      );
      if (moveReturn == "") {
        playerTurn = (playerTurn + 1) % 2;
        board.display(data => {
          io.emit("message", data);
        });
        users[playerTurn].emit("message", "your turn");
      } else {
        if (moveReturn.includes("won") || moveReturn.includes("Draw")) {
          io.emit("message", moveReturn);
          won = true;
          users[1].disconnect();
          users[0].disconnect();

          playerCounter = 0;
          board.resetBoard();
        } else socket.emit("message", moveReturn);
      }
    }
  });

  socket.on("disconnect", () => {
    if (won == false) {
      io.emit("message", `The other player resigned, you won!`);
      users[1].disconnect();
      users[0].disconnect();
      board.resetBoard();
    }

    playerCounter = 0;

    won = false;
    playerTurn = 0;
  });
});

http.listen(port, () => {
  console.log("listening on port:" + port);
});
