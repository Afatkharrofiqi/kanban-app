import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TasksContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    socket.emit("taskDragged", {
      source,
      destination,
    });
  };

  useEffect(() => {
    const fetchTasks = () => {
      fetch("http://localhost:4000/api")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
        });
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on("tasks", (data) => setTasks(data));
  }, [socket]);

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {tasks.length > 0 &&
          tasks.map((task) => {
            const name = task.title.toLowerCase();
            return (
              <div key={task.title} className={`${name}__wrapper`}>
                <h3>{name} Tasks</h3>
                <div className={`${name}__container`}>
                  <Droppable droppableId={task.title}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {task.items.length > 0 &&
                          task.items.map((item, idx) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={idx}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${name}__items`}
                                >
                                  <p>{item.title}</p>
                                  <p className="comment">
                                    <Link
                                      to={`/comments/${task.title}/${item.id}`}
                                    >
                                      {item.comments.length > 0
                                        ? "View Comments"
                                        : "Add Comment"}
                                    </Link>
                                  </p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
      </DragDropContext>
    </div>
  );
};

export default TasksContainer;
