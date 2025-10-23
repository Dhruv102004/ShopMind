import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import BuyerNavbar from "../../components/BuyerNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BuyerHome() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
    "electronics",
    "fashion",
    "home",
    "beauty",
    "sports",
    "books",
    "toys",
    "other",
  ]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  /* 
  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/get-categories`,
        { withCredentials: true }
      );
      setCategories(res.data.categories);
    }
    catch (err) {
      console.error("Error fetching categories:", err);
    }
    finally {
      setLoading(false);
    }
  };
 */
  const getProducts = async () => {
    setLoading(true);
    if (selectedCategory) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/buyer/get-product-by-categories?category=${selectedCategory}&page=${page}`,
          { withCredentials: true }
        );
        console.log(res.data);
        
        setProducts(res.data.products);
        setMaxPage(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/buyer/get-recommended-products?page=${page}`,
          { withCredentials: true }
        );
        console.log(res.data);
        
        setProducts(res.data.products);
        setMaxPage(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, [page, selectedCategory]);
  
  /* 
  useEffect(()=>{
    //getCategories();
  }, []) */

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-950 to-black">
        <BuyerNavbar />
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="p-6 flex items-center flex-col">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`my-6 ml-6 mr-2 ${
                    selectedCategory === ""
                      ? "bg-indigo-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white px-4 py-2 rounded-4xl shadow-md transition`}
                >
                  Recomended Products
                </button>

                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`my-6 mx-2 ${
                      selectedCategory === category
                        ? "bg-indigo-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    } text-white px-4 py-2 rounded-4xl shadow-md transition`}
                  >
                    {category[0].toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6">
                {products.length>0 && products.map((product) => (
                  <div key={product._id} className="hover:scale-105 hover:shadow-gray-700 cursor-pointer bg-gray-800/40 border border-gray-700/60 rounded-lg shadow-md overflow-hidden" onClick={()=>navigate('/buyer/products/'+product._id)}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg text-white font-semibold mb-2">{product.name}</h3>
                      <p className="text-white mb-2">₹{product.price.toFixed(2)} | {product.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            <div className="my-6 flex items-center justify-center">
              <button
                className={`${page === 1 ? "bg-gray-600 hover:bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}  text-white px-4 py-2 rounded-lg shadow-md transition`}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="mx-4 text-white">
                {page}/{maxPage}
              </span>
              <button
                className={`${page === maxPage ? "bg-gray-600 hover:bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} text-white px-4 py-2 rounded-lg shadow-md transition`}
                onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
                disabled={page === maxPage}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
