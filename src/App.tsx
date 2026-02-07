import { Toaster } from "react-hot-toast";
import {
  AuthPageContainer,
  ProductsPageContainer,
  NotFoundPage,
} from "./pages";
import { Navigate, Route, Routes } from "react-router-dom";
import { Button, ProtectedRoute, Spinner } from "./components";
import { useLazyGetUserQuery } from "./store/api/userApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { logOut } from "./store/slices/user";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [getUser, { isLoading }] = useLazyGetUserQuery();

  useEffect(() => {
    !user && getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user && (
        <Button
          onClick={() => dispatch(logOut())}
          className="w-40 mob:w-fit hover:w-100 fixed opacity-30 hover:opacity-90 top-10 p-5 right-10 z-10 truncate"
          type="submit"
        >
          <span>Выйти</span>
        </Button>
      )}
      <Toaster position="top-right" />
      {isLoading && !user ? (
        <Spinner
          size="large"
          className="fixed inset-0 z-50 flex items-center justify-center"
        />
      ) : (
        <Routes>
          <Route path="/login" element={<AuthPageContainer />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductsPageContainer />} />
          </Route>
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Navigate to="/products" replace />
              )
            }
          />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
