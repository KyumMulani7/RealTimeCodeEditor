const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executePy } = require("./executePy");
const { executeNode } = require("./executeNode");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.originalUrl}`);
//   res.sendFile(path.join(__dirname, "build", "index.html"));
//   next();
// });

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
// app.get("/*", function (req, res) {
//   console.log(`${req.method} ${req.originalUrl}`);
// });

// app.post("/*", function (req, res) {
//   console.log(`${req.method} ${req.originalUrl}`);
// });

// Websocket logic for real time sharing code
const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

//Compiler logic
app.post("/run", async (req, res) => {
  console.log("Inside run");
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  const filepath = await generateFile(language, code);
  let output;
  if (language === "py") {
    output = await executePy(filepath);
  } else if (language === "js") {
    output = await executeNode(filepath);
  }

  const deleteFile = filepath;
  if (fs.existsSync(deleteFile)) {
    fs.unlink(deleteFile, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("deleted code file");
    });
  }
  return res.json({ filepath, output });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
