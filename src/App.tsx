import { Toaster } from "react-hot-toast";
import { AuthPageContainer, HomePageContainer, NotFoundPage } from "./pages";
import { ReduxProvider } from "./store/ReduxProvider";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components";

function App() {
  return (
    <div>
      <ReduxProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPageContainer />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePageContainer />} />
            </Route>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ReduxProvider>
    </div>
  );
}

export default App;
