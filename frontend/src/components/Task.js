import Nav from "./Nav";
import TasksContainer from "./TasksContainer";
import AddTask from "./AddTask";
import socket from "../socket/socket";

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
