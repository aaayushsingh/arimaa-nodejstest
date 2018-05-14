var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 5050;
var board = require("./board");

// number of users
var userCount = 0;

// array to store sockets of users
var users = [null, null];

// the user that has to play next.
// Used to make sure only the user with the current turn can make a move
var userTurn = 0;

// check if the game is over
var won = false;

// when connection starts
io.on("connection", function(socket) {
  //max 2 users are only allowed at a time.
  if (userCount >= 2) {
    socket.emit("event", "Game already in progress, try again later!");
    socket.disconnect();
  } else {
    userCount++;
    users[userCount - 1] = socket;
    socket.emit("event", `You are user ${userCount}.`);
  }

  // when total number of users is 2, start the game
  if (userCount == 2) {
    io.emit("msg", "Let's begin!");
    board.display(function(data) {
      io.emit("msg", data);
    });
    users[0].emit("event", `Your turn`);
  }

  // when a player makes a move
  socket.on("move", function(msg) {
    // check if the game is already over, secondary check
    if (won) {
      socket.emit("msg", "Game Over! Type 'r' to exit");
    } // check if the user that sent the move is allowed to move
    else if (socket.id != users[userTurn].id) {
      socket.emit("msg", "wait for your turn");
    } //
    else {
      // get output from board
      var moveReturn = board.move(users[0].id == socket.id ? "X" : "O", msg);

      // empty output means move succesful
      if (moveReturn == "") {
        // cycle user turn
        userTurn = (userTurn + 1) % 2;

        // diaplay the board
        board.display(function(data) {
          io.emit("msg", data);
        });

        // notify the user with active turn to make a move
        users[userTurn].emit("msg", "your turn");
      } else {
        // won or draw check
        if (moveReturn.includes("won") || moveReturn.includes("draw")) {
          io.emit("msg", moveReturn);
          won = true;

          //disconnect users
          users[0].disconnect();
          users[1].disconnect();

          //reset stats
          userCount = 0;
          users = [null, null];

          //reset board
          board.reset();
        } else socket.emit("msg", moveReturn);
      }
    }
  });
  //console.log(`user ${userCount} connected`);

  // handle user disconnection between the game.
  socket.on("disconnect", function() {
    if (won == false) {
      io.emit("msg", `The other player resigned, you won!`);
      users[0].disconnect();
      users[1].disconnect();
      board.reset();
    }

    userCount = 0;
    won = false;
    var userTurn = 0;
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
