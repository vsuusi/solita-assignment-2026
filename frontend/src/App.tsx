import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";

import "./app.css";

import DashboardPage from "./pages/DashboardPage";
import SingleDayPage from "./pages/SingleDayPage";

const Layout = () => {
  return (
    <div className="app-container">
      <header>
        <nav>
          <Link to="/" className="nav-link">
            ⚡️ Electricity App
          </Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <small>© 2026 Dev Academy Exercise</small>
      </footer>
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <DashboardPage /> },
        { path: "/day/:date", element: <SingleDayPage /> },
        { path: "*", element: <Navigate to="/" /> },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
