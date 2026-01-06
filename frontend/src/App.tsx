import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import TodoApp from "./pages/TodoApp";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/todo" element={<TodoApp />} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
