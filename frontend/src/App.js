import { BrowserRouter, Routes, Route } from "react-router-dom";
import Comments from "./components/Comments";
import Login from "./components/Login";
import Task from "./components/Task";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/task" element={<Task />} />
        <Route path="/comments/:category/:id" element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
