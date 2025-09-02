const logEvents = require("./logEvents");
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("log", (msg) => logEvents(msg));
myEmitter.emit("log", "Log event emitted!");
