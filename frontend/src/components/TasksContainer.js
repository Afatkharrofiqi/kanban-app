import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TasksContainer = () => {
  const [tasks, setTasks] = useState({});

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

  return (
    <div className="container">
      {tasks.length > 0 &&
        tasks.map((task, index) => {
          const name = task.title.toLowerCase();
          return (
            <div key={index} className={`${name}__wrapper`}>
              <h3>{name} Tasks</h3>
              <div className={`${name}__container`}>
                {task.items.length > 0 &&
                  task.items.map((item, idx) => {
                    return (
                      <div key={idx} className={`${name}__items`}>
                        <p>{item.title}</p>
                        <p className="comment">
                          <Link to="/comments">
                            {item.comments.length > 0
                              ? "View Comments"
                              : "Add Comment"}
                          </Link>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TasksContainer;
