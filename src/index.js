// const openCV = require("opencv4nodejs-prebuilt-install");

const express = require("express");
const fs = require("fs");
const app = express();
const serverHttp = require("http");

const socketIO = require("socket.io");
const path = require("path");

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const server = serverHttp.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

let wCap;

const FPS = 10;
let timeInterval;

function base64_encode(file) {
  // read binary data
  const imageAsBase64 = fs.readFileSync(file, "base64");
  return imageAsBase64;
}

app.get("/", (req, res) => {
  console.log("home");
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// app.get("/about", (req, res) => {
//   res.sendFile(path.join(__dirname, "about.html"));
// });

const endpoint = io.of("/camera");

endpoint.on("connection", (socket) => {
  // wCap = new openCV.VideoCapture(0);
  console.log("A client connected to the /camera endpoint");
  socket.on("data", function (data) {
    console.log(`data received is '${data}'`);
  });
  serveCameraImages(socket);

  socket.on("disconnect", () => {
    console.log("A client disconnected from the /camrea endpoint");
    // wCap.release();
    clearInterval(timeInterval);
  });
});

function serveCameraImages(socket) {
  timeInterval = setInterval(() => {
    // const frame = wCap.read();
    // const image = openCV.imencode(".jpg", frame).toString("base64");
    const image = base64_encode(path.resolve(__dirname, "assets/botMap.png"));
    socket.emit("image", image);
  }, 1000 / FPS);
}

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
