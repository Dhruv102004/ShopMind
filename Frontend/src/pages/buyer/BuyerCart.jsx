import { useEffect, useState } from "react";
import BuyerNavbar from "../../components/BuyerNavbar";
import Loader from "../../components/Loader";
import { Trash2 } from "lucide-react";
import axios from "axios";

function BuyerCart() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const getCartItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart/get-items`,
        { withCredentials: true }
      );
      console.log(res.data);
      setCart(res.data.cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (id, quant) => {
    console.log(id);
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/update-item/${id}`,
        null,
        {
          params: { quantity: quant + 1 },
          withCredentials: true,
        }
      );
      console.log(res.data);
      getCartItems();
    } catch (error) {
      console.error("Error increasing item quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const decreaseQty = async (id, quant) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/update-item/${id}`,
        null,
        {
          params: { quantity: quant - 1 },
          withCredentials: true, // ✅ included correctly
        }
      );
      console.log(res.data);
      getCartItems();
    } catch (error) {
      console.error("Error increasing item quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = (id) => {
    setLoading(true);
    try{
        const res = axios.post(
            `${import.meta.env.VITE_API_URL}/cart/remove-item/${id}`,
            null,
            { withCredentials: true }
        );
        console.log(res.data);
        getCartItems();
    } catch (error) {
        console.error("Error removing item from cart:", error);
    } finally {
        setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-950 to-black text-white">
      <BuyerNavbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6 flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-semibold text-indigo-400 mb-4">
            Your Cart
          </h2>

          {/* Cart Items */}
          <div className="w-full max-w-2xl space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="bg-gray-800/60 p-4 rounded-2xl flex justify-between items-center shadow-lg border border-gray-700"
              >
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={item.picture}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-600 shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity + Delete */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decreaseQty(item.productId, item.quantity)}
                      className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.productId, item.quantity)}
                      className="px-3 py-1 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => deleteItem(item.productId)}
                    className="p-2 bg-red-600/80 hover:bg-red-500 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total + Checkout */}
          {cart.length === 0 ? (
            <div className="w-full max-w-2xl mt-6 bg-gray-800/70 p-5 rounded-2xl border border-gray-700 shadow-xl">
                Your cart is empty.
            </div>
          ) : (
            <div className="w-full max-w-2xl mt-6 bg-gray-800/70 p-5 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex justify-between text-xl font-semibold mb-4">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={() => alert("Proceeding to checkout...")}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold transition"
            >
              Checkout
            </button>
          </div>
          )}
          
        </div>
      )}
    </div>
  );
}

export default BuyerCart;
