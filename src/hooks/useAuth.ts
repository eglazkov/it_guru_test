import { useState } from "react";
import { useAuthUserMutation } from "../store/api/userApi";
import { getUserLoginByEmail } from "../store/api/usersEmailLoginMap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isFetchBaseQueryError, isSerializedError } from "../lib/utils";

export interface AuthData {
  email: string;
  password: string;
  isRememberMe: boolean;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onRemindChange: (isRemind: boolean) => void;
  onSubmit: (rememberme: boolean) => void;
}

export const useAuth = (): AuthData => {
  const navigate = useNavigate();
  const [authUser, { isLoading }] = useAuthUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);

  const handleSubmit = async (rememberme: boolean) => {
    try {
      const response = await authUser({
        credentials: {
          username: getUserLoginByEmail(email),
          password,
          expiresInMins: 15,
        },
        rememberme,
      }).unwrap();

      toast.success("Добро пожаловать!");
      const storage = isRememberMe ? localStorage : sessionStorage;
      if (response.refreshToken) {
        storage.setItem("refreshToken", response.refreshToken);
      }
      navigate("/products");
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        toast.error((error.data as { message: string })?.message || "Ошибка");
      } else if (isSerializedError(error)) {
        toast.error(error.message || "Ошибка");
      } else {
        toast.error(`Системная ошибка\n${error}`);
      }
    }
  };

  return {
    email,
    password,
    isRememberMe,
    isLoading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onRemindChange: setIsRememberMe,
    onSubmit: handleSubmit,
  };
};
