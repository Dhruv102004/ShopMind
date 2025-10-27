import { useState } from "react";
import BuyerNavbar from "../../components/BuyerNavbar";
import Loader from "../../components/Loader";
import { Trash2 } from "lucide-react";

function BuyerCart() {
  const [loading, setLoading] = useState(false);

  // Sample items — replace with your actual cart data
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1999,
      quantity: 1,
      picture: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 2,
      name: "Bluetooth Speaker",
      price: 1499,
      quantity: 2,
      picture: "https://images.unsplash.com/photo-1589384267890-9c12e26bcb32?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 2599,
      quantity: 1,
      picture: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0643?auto=format&fit=crop&w=100&q=80",
    },
  ]);

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                key={item.id}
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
                      onClick={() => decreaseQty(item.id)}
                      className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-3 py-1 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
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
        </div>
      )}
    </div>
  );
}

export default BuyerCart;
