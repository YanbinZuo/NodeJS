const logEvents = require("./logEvents");

const EventEmitter = require("events");

// initialize object
const myEmitter = new EventEmitter();

// add listener for the log event
myEmitter.on("log", (msg) => logEvents(msg));

setTimeout(() => {
  // Emit event
  myEmitter.emit("log", "Log event emitted!");
}, 1000);
