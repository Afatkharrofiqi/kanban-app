const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("fetchComments", (data) => {
    const { category, id } = data;
    const task = tasks.find((task) => task.title === category);
    const taskItems = task.items;

    taskItems.map((item) => {
      if (item.id === id) {
        socket.emit("comments", item.comments);
      }
    });
  });

  socket.on("addComment", (data) => {
    const { category, userId, comment, id } = data;
    const task = tasks.find((task) => task.title === category);
    const taskItems = task.items;

    // loop through the list of items to find a matching ID
    taskItems.map((item) => {
      if (item.id === id) {
        // then adds the comment to the list of comments under the item (task)
        item.comments.push({
          name: userId,
          text: comment,
          id: fetchID(),
        });

        // sends a new event to the React app
        socket.emit("comments", item.comments);
      }
    });
  });

  socket.on("createTask", (data) => {
    const newTask = { id: fetchID(), title: data.task, comments: [] };

    // add the task to pending category
    tasks[0].items.push(newTask);

    socket.emit("tasks", tasks);
  });

  socket.on("taskDragged", (data) => {
    const { source, destination } = data;

    // gets the item that was dragged
    const taskMoved = tasks.find((task) => task.title === source.droppableId);
    const itemMoved = taskMoved.items[source.index];

    // remove the item from the its source
    tasks.map((task) => {
      if (taskMoved.title === task.title) {
        task.items.splice(source.index, 1);
      }
    });

    // add the item to its destination using its destination index
    tasks.map((task) => {
      if (destination.droppableId === task.title) {
        task.items.splice(destination.index, 0, itemMoved);
      }
    });

    socket.emit("tasks", tasks);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/", (req, res) => {
  res.json({
    hello: "😊",
    myName: "Achmad Fatkharrofiqi",
    github: "https://github.com/Afatkharrofiqi",
    email: "achmadfatkharrofiqi404@gmail.com",
  });
});

app.get("/api", (req, res) => {
  res.json(tasks);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
