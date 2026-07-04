// Root application component.
// AuthProvider wraps the Router so every page (protected or not) has
// access to auth state via useAuth() — including pages inside Router
// like ProtectedRoute, which needs useLocation for redirects.

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
