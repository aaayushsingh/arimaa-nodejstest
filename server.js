const app = require("express")();
const http = require("http").Server(app);

//http server
const port = 5050;

http.listen(port, () => {
  console.log("server started on port: " + port);
});

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
      io.emit(
        "conn",
        `player ${playerCounter} connected... wait for player 2 `
      );
    } else {
      io.emit("conn", `player ${playerCounter} connected.`);
    }
  }
  // start game
  if (playerCounter == 2) {
    io.emit("message", "Start the game -- Player 1's turn");
    //reset the board and start a new game
    board.resetBoard();
    board.display(data => {
      io.emit("message", data);
    });
  }
  /* =====================================================
      player moves
  ======================================================*/
  socket.on("move", message => {
    if (socket.id != users[playerTurn].id) {
      socket.emit("message", "Wait for the other player to make a move.");
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
        } else socket.emit("message", moveReturn);
      }
    }
  });

  socket.on("disconnect", () => {
    if (won == false) {
      io.emit("message", `The other player resigned, you won!`);
      users[1].disconnect();
      users[0].disconnect();
    }
    //reset data
    playerCounter = 0;
    won = false;
    playerTurn = 0;
  });
});
