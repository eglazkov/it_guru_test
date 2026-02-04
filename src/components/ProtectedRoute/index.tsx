import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  // Если токена нет, перенаправляем на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть, рендерим вложенные роуты
  return <Outlet />;
};

export default ProtectedRoute;
