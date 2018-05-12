var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 5050;
var board = require('./board');

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var userCount = 0;
var users = [null, null];
var userTurn = 0;

io.on("connection", function(socket) {
  userCount++;
  if (userCount > 2) {
    socket.emit("event", "Game already in progress, try again later!");
    socket.disconnect();
  } else {
    users[userCount - 1] = socket;
  }

  socket.on("move", function(msg){
      if(socket.id != users[userTurn].id){
          socket.emit("msg", "wait for your turn");
      } else
  })
  console.log(`user ${userCount} connected`);
  if (userCount > 2) {
    io.emit("");
  }
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
    console.log(msg);
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
