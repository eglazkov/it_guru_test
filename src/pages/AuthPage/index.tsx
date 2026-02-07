import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import AuthPage from "./AuthPage";
import type { RootState } from "../../store/store";
import { Navigate } from "react-router-dom";

const AuthPageContainer = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return <Navigate to="/products" replace />;
  }

  const authData = useAuth();

  return <AuthPage data={authData} />;
};

export default AuthPageContainer;
