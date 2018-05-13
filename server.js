var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 5050;
var board = require("./board");

var userCount = 0;
var users = [null, null];
var userTurn = 0;
var won = false;
io.on("connection", function(socket) {
  if (userCount >= 2) {
    socket.emit("event", "Game already in progress, try again later!");
    socket.disconnect();
  } else {
    userCount++;
    users[userCount - 1] = socket;
    io.emit("event", `user ${userCount} connected.`);
  }
  if (userCount == 2) {
    io.emit("msg", "Let's begin!");
    board.display(function(data) {
      io.emit("msg", data);
    });
  }

  socket.on("move", function(msg) {
    if (won) {
      socket.emit("msg", "Game Over! Type 'r' to exit");
    } else if (socket.id != users[userTurn].id) {
      socket.emit("msg", "wait for your turn");
    } else {
      //userTurn = (userTurn + 1) % 2;
      //socket.emit("msg", msg);
      var moveReturn = board.move(users[0].id == socket.id ? "X" : "O", msg);
      if (moveReturn == "") {
        userTurn = (userTurn + 1) % 2;
        board.display(function(data) {
          io.emit("msg", data);
        });
        users[userTurn].emit("msg", "your turn");
      } else {
        if (moveReturn.includes("won") || moveReturn.includes("draw")) {
          io.emit("msg", moveReturn);
          won = true;
          users[0].disconnect();
          users[1].disconnect();
          userCount = 0;
          users = [null, null];
          board.reset();
        } else socket.emit("msg", moveReturn);
      }
    }
  });
  //console.log(`user ${userCount} connected`);

  socket.on("disconnect", function() {
    if (users[0].id == socket.id && won != true) {
      io.emit("msg", `user ${1} disconnected, you are now user 1`);
      users[0] = users[1];
      board.reset();
    } else if (won != true) {
      users[0] = users[1];
      io.emit("msg", `user ${2} disconnected`);
      board.reset();
    }

    userCount--;
    won = false;
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
