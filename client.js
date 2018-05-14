const readcommand = require("readcommand");
const socket = require("socket.io-client")(
  `http://${process.argv[2]}:${process.argv[3]}`
);

/* ==========================================================================
     Read console arguments
 ==========================================================================*/

readcommand.loop((err, args, str, next) => {
  if (args[0] == "r") {
    console.log("You lost the game because you resigned");
    process.exit(0);
  }
  if (args[0] <= 9 && args[0] >= 1) {
    socket.emit("move", args[0]);
  } else {
    console.log(
      "invalid move, select a number between '1-9' or press 'r' to resign"
    );
  }
  return next();
});

/* ==========================================================================
     Socket messages
 ==========================================================================*/

socket.on("conn", data => {
  console.log(data);
});

socket.on("disconnect", data => {
  process.exit(0);
});
socket.on("message", data => {
  console.log(data);
});
