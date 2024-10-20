import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/HOC/PrivateRoute";
import Content from "../src/pages/Content";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Content />} />

      <Route path="*" element={<Content />} />
    </Routes>
  );
};

export default App;
