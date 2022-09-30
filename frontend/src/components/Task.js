import Nav from "./Nav";
import TasksContainer from "./TasksContainer";
import socketIO from "socket.io-client";
import AddTask from "./AddTask";

const socket = socketIO.connect("http://localhost:4000");

const Task = () => {
  return (
    <div>
      <Nav />
      <AddTask socket={socket} />
      <TasksContainer socket={socket} />
    </div>
  );
};

export default Task;
