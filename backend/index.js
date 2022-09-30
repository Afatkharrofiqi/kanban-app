const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

http.Server(app);

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`A user disconnected`);
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
