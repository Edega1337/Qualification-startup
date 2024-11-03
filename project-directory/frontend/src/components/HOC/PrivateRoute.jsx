import { Navigate } from "react-router-dom";
import { useStore } from "../../store/useStore";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { accessToken } = useStore((state) => state);

  return accessToken ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
