const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const logEvents = require("./logEvents");
// Load MIME types from JSON file
const mimeTypes = require("./mime.json");
const EventEmitter = require("events");

const myEmitter = new EventEmitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filepath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filepath,
      !contentType.includes("image") ? "utf8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filepath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.error(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  // Decode and inspect
  const decodedPath = decodeURIComponent(pathname);
  console.log("decodedPath: ", decodedPath);
  // extension handling
  const rawExt = path.extname(decodedPath).toLowerCase();
  const hasExt = rawExt !== "";
  const ext = hasExt ? rawExt : "./html";
  const contentType = mimeTypes[ext] || "text/html";

  // Build relative path safely
  let relPath;
  /**
  Build file path depending on content type:
  If HTML:
    / → views/index.html
    /about/ → views/about/index.html
    /about.html → views/about.html
  If not HTML (like CSS, JS, images):
    Look for files relative to the project root (__dirname).
  */
  if (!hasExt || ext === ".html") {
    console.log("------1");
    if (decodedPath === "/") {
      console.log("------3");
      relPath = path.join("views", "index.html");
    } else if (decodedPath.endsWith("/")) {
      console.log("------4");
      // /docs/ -> /views/docs/index.html
      // strip leading slash so __dirname isn't ignored
      relPath = path.join("views", decodedPath.slice(1), "index.html");
    } else {
      console.log("-----5");
      // /about -> views/about.html   |   /about.html -> views/about.html
      relPath = path.join(
        "views",
        decodedPath.slice(1) + (hasExt ? "" : ".html")
      );
    }
  } else {
    console.log("-------2");
    // Static asset: /css/style.css -> css/style.css
    relPath = decodedPath.slice(1);
  }

  console.log("-------6: relPath: ", relPath);
  // Normalize and block traversal
  relPath = path.normalize(relPath).replace(/^(\.\.[/\\])+/, "");
  // Final absolute path
  const filePath = path.join(__dirname, relPath);

  console.log("filePath: ", filePath);
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      // 301 redirect
      case "old-page.html":
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { location: "/" });
        res.end();
        break;
      default:
        // 404
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }

    // console.log(path.parse(filePath));
  }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
