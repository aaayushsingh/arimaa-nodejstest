var app = require("express");
var http = require("http").Server(app);

//connect to the server at localhost:5050
var socket = require("socket.io-client")(
  `http://${process.argv[2]}:${process.argv[3]}`
);

//read commands from cli
var readcommand = require("readcommand");

socket.on("event", function(data) {
  console.log(data);
});

// terminate program on socket disconnection
socket.on("disconnect", function(data) {
  process.exit(0);
});

// display msg event to console
socket.on("msg", function(data) {
  console.log(data);
});

readcommand.loop(function(err, args, str, next) {
  // exit client if input is 'r'
  if (args[0] == "r") {
    console.log("you lost");
    process.exit(0);
  }

  // else check validity of inputs
  if (args[0] <= 9 && args[0] >= 1) {
    //console.log("Received args: %s", JSON.stringify(args));
    socket.emit("move", args[0]);
  } else {
    console.log("invalid move, select a number between 1-9");
  }
  return next();
});
