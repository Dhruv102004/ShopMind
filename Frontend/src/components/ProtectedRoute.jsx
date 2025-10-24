import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const _id = localStorage.getItem("_id");
  const isSeller = localStorage.getItem("isSeller"); // stored as string
  const location = useLocation();

  // 1️⃣ Check login
  if (!_id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2️⃣ If isSeller missing (possible tampering or storage issue)
  if (isSeller === null) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3️⃣ Route redirection logic
  if (location.pathname.startsWith("/seller") && isSeller !== "true") {
    return <Navigate to="/unauthorized" replace />;
  }

  if (location.pathname.startsWith("/buyer") && isSeller === "true") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Otherwise allow access
  return children;
};

export default ProtectedRoute;
