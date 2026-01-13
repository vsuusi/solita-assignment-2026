import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import SingleDayPage from "./pages/SingleDayPage";

const Layout = () => {
  return (
    <div className="app-container">
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <nav>
          <Link to="/" style={{ marginRight: "1rem", fontWeight: "bold" }}>
            ⚡️ Electricity App
          </Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>

      <footer
        style={{ marginTop: "auto", padding: "1rem", background: "#f5f5f5" }}
      >
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
