import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/HOC/PrivateRoute";
import { ThemeProvider } from '@material-ui/core/styles';
import SignIn from "./pages/Authentication/SighIn"
import Content from "../src/pages/Content";
import ProfilePage from "../src/pages/Profile/ProfilePage";
import AdDetail from "./pages/AdPage";
import SignUp from "./pages/Registration/SignUp";
import MyResponses from "./pages/ResponsesUser";
import ModerationPanel from "./pages/ModerationPanel";
import AnalyticsPanel from "./pages/AnalyticsPanel";
import theme from "./theme";

import "./App.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="*" element={<Content />} />
        <Route path="/registration" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ads/:id" element={<AdDetail />} />
        <Route path="/user/responses" element={<MyResponses />} />
        <Route path="/moderation" element={<ModerationPanel />} />
        <Route path="/analytics" element={<AnalyticsPanel />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
