import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/HOC/PrivateRoute";
import { ThemeProvider } from '@material-ui/core/styles';
import SignIn from "./pages/Authentication/SighIn"
import Content from "../src/pages/Content";
import theme from "./theme";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="*" element={<Content />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
