import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import AuthPage from "./AuthPage";
import type { RootState } from "../../store/store";
import { Navigate } from "react-router-dom";

const AuthPageContainer = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const authData = useAuth();

  if (user) {
    return <Navigate to="/products" replace />;
  }

  return <AuthPage data={authData} />;
};

export default AuthPageContainer;
