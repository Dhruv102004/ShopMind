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
import SellerHome from "./pages/seller/SellerHome";
import SellerProducts from "./pages/seller/SellerProducts";



const appRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/users/home", element: <UsersHome /> },
  { path: "/seller/home", element: <SellerHome /> },
  { path: "/seller/products", element: <SellerProducts /> },
  { index: true, path: "/", element: <Navigate to="/login" /> },
]);


function App() {
  return <RouterProvider router={appRouter} />;
  
}

export default App
