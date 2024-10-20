import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/HOC/PrivateRoute";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/profile" element={<PrivateRoute element={Profile} />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default App;
