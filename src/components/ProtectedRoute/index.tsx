import { type FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Если user нет, перенаправляем на логин
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если user есть, рендерим вложенные роуты
  return <Outlet />;
};

export default ProtectedRoute;
