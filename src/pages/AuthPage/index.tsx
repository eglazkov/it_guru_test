import { useAuth } from "../../hooks/useAuth";
import AuthPage from "./AuthPage";

const AuthPageContainer = () => {
  const authData = useAuth();

  return <AuthPage data={authData} />;
};

export default AuthPageContainer;
