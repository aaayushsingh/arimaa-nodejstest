var app = require("express");
var http = require("http").Server(app);
var socket = require("socket.io-client")(`http://localhost:5050`);
var readcommand = require("readcommand");
var result;
http.listen(process.argv[3], process.argv[2], function() {
  console.log(`connected to ${process.argv[2]} : ${process.argv[3]}`);
});

socket.on("event", function(data) {
  console.log(data);
  //   socket.emit("hello", "world");
});

socket.on("disconnect", function(data) {
  //console.log("disconnected");
  process.exit(0);
});
socket.on("msg", function(data) {
  console.log(data);
});
// readcommand.read(function(err, args) {
//   socket.emit("chat message", "hello");
//   console.log("Arguments: %s", JSON.stringify(args));
// });

readcommand.loop(function(err, args, str, next) {
  if (args[0] == "exit") {
    process.exit(0);
  }
  if (args[0] <= 9 && args[0] >= 1) {
    //console.log("Received args: %s", JSON.stringify(args));
    socket.emit("move", args[0]);
  } else {
    console.log("invalid move, select a number between 1-9");
  }
  return next();
});
