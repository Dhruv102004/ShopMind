import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function BuyerPaymentSuccess() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/buyer/cart");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
                Payment Failure!
            </h1>
            <p className="text-gray-600 mb-4">
                Redirecting in {countdown} seconds...
            </p>
            <div className="inline-block p-2 bg-red-100 rounded-full">
                <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
        </div>
    </div>
);
}

export default BuyerPaymentSuccess;
