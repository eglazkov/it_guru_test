import { Toaster } from "react-hot-toast";
import {
  AuthPageContainer,
  ProductsPageContainer,
  NotFoundPage,
} from "./pages";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components";
import { useLazyGetUserQuery } from "./store/api/userApi";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [getUser, { data, isLoading }] = useLazyGetUserQuery();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    !isLoading && !data && navigate("/login");
  }, [isLoading, data]);

  return (
    <>
      <Toaster position="top-right" />
      {isLoading && !data ? (
        <div>Загрузка...</div>
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
