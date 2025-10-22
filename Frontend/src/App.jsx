import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";

import Login from './pages/Login'
import Register from "./pages/Register";
import UsersHome from "./pages/users/UsersHome";



const appRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/users/home", element: <UsersHome /> },
]);


function App() {
  return <RouterProvider router={appRouter} />;
  
}

export default App
