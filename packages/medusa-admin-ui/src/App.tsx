import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./components";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Dashboard = lazy(() => import("./pages/dashboard"));

const pageRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} errorElement={<ErrorBoundary />} />
      <Route
        path="/dashboard"
        element={<Dashboard />}
        errorElement={<ErrorBoundary />}
      />
      <Route
        path="/login"
        element={<Login />}
        errorElement={<ErrorBoundary />}
      />
    </>
  ),
  {
    basename: "/app",
  }
);

const Loading = () => (
  <div className="w-full h-screen flex items-center justify-center">
    Loading...
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={pageRouter} />
    </Suspense>
  );
}

export default App;
