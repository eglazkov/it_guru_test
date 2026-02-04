import { useState } from "react";
import { useAuthUserMutation } from "../store/api/userApi";
import { getUserLoginByEmail } from "../store/api/usersEmailLoginMap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isFetchBaseQueryError, isSerializedError } from "../lib/utils";

export interface AuthData {
  email: string;
  password: string;
  isRemind: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onRemindChange: (isRemind: boolean) => void;
  onSubmit: () => void;
}

export const useAuth = (): AuthData => {
  const navigate = useNavigate();
  const [authUser] = useAuthUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemind, setIsRemind] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await authUser({
        username: getUserLoginByEmail(email),
        password,
        expiresInMins: 10,
      }).unwrap();

      toast.success("Добро пожаловать!");
      const storage = isRemind ? localStorage : sessionStorage;
      storage.setItem("token", response.refreshToken);
      navigate("/home");
    } catch (error) {
      // Ваша обработка ошибок...
      if (isFetchBaseQueryError(error)) {
        toast.error((error.data as { message: string })?.message || "Ошибка");
      } else if (isSerializedError(error)) {
        toast.error(error.message || "Ошибка");
      } else {
        toast.error("Системная ошибка");
      }
    }
  };

  return {
    email,
    password,
    isRemind,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onRemindChange: setIsRemind,
    onSubmit: handleSubmit,
  };
};
