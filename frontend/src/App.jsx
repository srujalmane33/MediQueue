import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { loadUser } from "./store/slices/authSlice";
import Loader from "./components/Loader";
import { initiateSocketConnection, disconnectSocket } from "./utils/socket";

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      initiateSocketConnection(user._id);
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  if (loading) {
    return <Loader />;
  }

  return <AppRoutes />;
}

export default App;