// How NodeJS differs from Vanilla JS
// 1) Node runs on a server - not in a browser (backend not frontend)
// 2) The console is the terminal window
// 3) global object instead of window object
console.log(global);

// 4) Has Common Core modules that we will explore
// 5) CommonJS modules instead of ES6 modules
// 6) Missing some JS APIs like fetch

const os = require("os");
const path = require("path");

const math = require("./math");
// another way
// const {add, subtract, multiply, divide} = require("./math")

console.log("---------------------------------------");
console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
// E:\iLearning\Youtube\DaveGray\NodeJS\01Intro
console.log(__filename);
// E:\iLearning\Youtube\DaveGray\NodeJS\01Intro\server.js

console.log("---------------------------------------");

console.log(path.dirname(__filename));
// E:\iLearning\Youtube\DaveGray\NodeJS\01Intro
console.log(path.basename(__filename));
// server.js
console.log(path.extname(__filename));
// .js

console.log(path.parse(__filename));
// {
//   root: 'E:\\',
//   dir: 'E:\\iLearning\\Youtube\\DaveGray\\NodeJS\\01Intro',
//   base: 'server.js',
//   ext: '.js',
//   name: 'server'
// }

console.log(math.add(2, 3));
