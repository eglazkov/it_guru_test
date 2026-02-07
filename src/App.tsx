import { Toaster } from "react-hot-toast";
import {
  AuthPageContainer,
  ProductsPageContainer,
  NotFoundPage,
} from "./pages";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { useLazyGetUserQuery } from "./store/api/userApi";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [getUser, { data, isLoading }] = useLazyGetUserQuery();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && !data) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data]);

  return (
    <>
      <Toaster position="top-right" />
      {isLoading && !data ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-80 h-80 border-4 border-[#242EDB]/20 border-t-[#242EDB] rounded-full animate-spin"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<AuthPageContainer />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductsPageContainer />} />
          </Route>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
