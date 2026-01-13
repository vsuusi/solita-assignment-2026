import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import SingleDayPage from "./pages/SingleDayPage";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <DashboardPage /> },
    { path: "/day/:date", element: <SingleDayPage /> },
    { path: "*", element: <Navigate to="/" /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
