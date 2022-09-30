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

//👇🏻 Generates a random string
const fetchID = () => Math.random().toString(36).substring(2, 10);
//👇🏻 Nested object
let tasks = [
  {
    title: "pending",
    items: [
      {
        id: fetchID(),
        title: "Send the Figma file to Dima",
        comments: [],
      },
    ],
  },
  {
    title: "ongoing",
    items: [
      {
        id: fetchID(),
        title: "Review GitHub issues",
        comments: [
          {
            name: "David",
            text: "Ensure you review before merging",
            id: fetchID(),
          },
        ],
      },
    ],
  },
  {
    title: "completed",
    items: [
      {
        id: fetchID(),
        title: "Create technical contents",
        comments: [
          {
            name: "Dima",
            text: "Make sure you check the requirements",
            id: fetchID(),
          },
        ],
      },
    ],
  },
];

app.get("/api", (req, res) => {
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
