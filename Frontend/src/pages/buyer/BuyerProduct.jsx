import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import BuyerNavbar from "../../components/BuyerNavbar";

export default function BuyerProduct() {
  const { id } = useParams(); // ✅ get product ID from URL
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/buyer/get-product/${id}`,
          { withCredentials: true }
        );
        setProduct(res.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <BuyerNavbar />
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* 🖼 Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg shadow-lg w-full h-96 object-cover border border-gray-700"
          />
        </div>

        {/* 📦 Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-400 mb-4">{product.description}</p>

          <p className="text-lg mb-2">
            <span className="font-semibold text-gray-300">Category:</span>{" "}
            {product.category}
          </p>
          <p className="text-2xl font-semibold text-indigo-400 mb-6">
            ₹{product.price.toFixed(2)}
          </p>

          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition">
            Add to Cart
          </button>
          <button className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg shadow-md transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
