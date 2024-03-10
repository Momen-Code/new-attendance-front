import { QueryClient, QueryClientProvider } from "react-query";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Loader } from "./components";
import {
  Actions,
  Barcode,
  Camera,
  Dashboard,
  Edit,
  Home,
  InOut,
  Login,
  Register,
  Splash,
  TypeAction,
  Users,
} from "./pages";
import { useAuthContext } from "./provider";

//Styles
import "react-notifications/lib/notifications.css";
import "./assets/styles/_global.scss";

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn } = useAuthContext();
  return (
    <div className="app-container">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Loader />
          {isLoggedIn && (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/:type/edit/:id" element={<Edit />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
          {!isLoggedIn && (
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inOut" element={<InOut />} />
              <Route path="/actions/:type" element={<Actions />} />
              <Route
                path="/:status/type-action/:type"
                element={<TypeAction />}
              />
              <Route path="/:status/barcode/:type" element={<Barcode />} />
              <Route path="/:type/registration" element={<Register />} />
              <Route path="/camera/:status" element={<Camera />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          )}
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
