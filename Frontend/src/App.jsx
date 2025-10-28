import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";

import Login from './pages/Login'
import Register from "./pages/Register";
import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerProduct from "./pages/buyer/BuyerProduct";
import BuyerSearchResults from "./pages/buyer/BuyerSearchResults";
import SellerHome from "./pages/seller/SellerHome";
import SellerProducts from "./pages/seller/SellerProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import BuyerCart from "./pages/buyer/BuyerCart";


// Protected layout with Navbar
const ProtectedLayout = () => (
  <ProtectedRoute>
    <>
      <div className="group-hover:ml-64 transition-all duration-300 w-full bg-gray-50 min-h-screen ">
        <Outlet />
      </div>
      <footer className="text-center text-sm text-white bg-black py-4">
        Copyright © 2025 <Link className="text-blue-800" to='/'>ShopMIND</Link>. All rights reserved.
      </footer>
    </>
  </ProtectedRoute>
);



const appRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  { path: "/unauthorized", element: <h1 className="text-center mt-20 text-2xl font-bold">Unauthorized Access</h1> },
  { path: "/buyer/", element: <ProtectedLayout />, 
    children: [
      { path: "home", element: <BuyerHome /> },
      { path: "search-results", element:<BuyerSearchResults /> },
      { path: "products/:id", element: <BuyerProduct /> },
      { path: "cart", element: <BuyerCart /> },
      { index: true, element: <Navigate to="home" /> },
    ]
  },
  { path: "/seller/", element: <ProtectedLayout />, 
    children: [
      { path: "home", element: <SellerHome /> },
      { path: "products", element: <SellerProducts /> },
      { index: true, element: <Navigate to="home" /> },
    ]
  },

  { index: true, path: "/", element: <Navigate to="/login" /> },
]);


function App() {
  return <RouterProvider router={appRouter} />;
  
}

export default App
