import React, { useEffect, useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import Loader from "../../components/Loader";
import SellerNavbar from "../../components/SellerNavbar";
import axios from "axios";

export default function SellerProducts() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: [],
    category: "",
  });

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller/get-products`,
        {
          withCredentials: true,
        }
      );

      setProducts(res.data.products);
      setMaxPage(res.data.maxPage || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller/get-categories`,
        { withCredentials: true }
      );
      console.log(res.data);

      setCategories(res.data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/seller/search-products?name=${searchQuery}`,
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Error searching products:", err);
    }
  };

  const addProduct = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("image", formData.image[0]);
    formDataToSend.append("category", formData.category);

    // Append all photos
    /* 
    formData.image.forEach((img) => {
      formDataToSend.append("image", img);
    });
    */

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/seller/add-product`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getProducts();
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: [],
        category: "",
      });
      setOpen(false);
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, ...files], // ✅ Append instead of replace
    }));
  };

  // Remove selected photo
  const handleRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/seller/update-product/${
          editProduct._id
        }`,
        editProduct,
        {
          withCredentials: true, // allow backend to set cookies
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      getProducts();
      setEditProduct(null);
    } catch (err) {
      console.error("Error editing product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/seller/delete-product/${
          deleteProduct._id
        }`,
        {
          withCredentials: true,
        }
      );
      getProducts();
      setDeleteProduct(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, [page]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-950 to-black">
          <SellerNavbar />

          <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Your Products
              </h2>

              {/* Center: Search bar */}
              <div className="flex-1 flex justify-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-1/2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)} // optional handler
                />
              </div>

              <button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                + Add Product
              </button>
            </div>
            <div className="overflow-x-auto bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg mt-6">
              <table className="min-w-full text-gray-200">
                <thead>
                  <tr className="bg-gray-800 text-gray-300 uppercase text-sm tracking-wider">
                    <th className="px-6 py-3 text-left">Product Image</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Quantity</th>
                    <th className="px-6 py-3 text-left">Analytics</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-gray-400 py-6 italic"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-t border-gray-700 hover:bg-gray-800/60 transition"
                      >
                        {/* Product ID + Copy Button */}
                        <td className="px-6 py-4 flex items-center space-x-2">
                          <img
                            src={
                              product.image || "https://via.placeholder.com/100"
                            }
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>

                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4 truncate max-w-[250px] text-gray-400">
                          {product.description}
                        </td>
                        <td className="px-6 py-4">₹{product.price}</td>
                        <td className="px-6 py-4">{product.quantity}</td>
                        <td className="px-6 py-4">
                          <p>Purchased: {product.purchasedBy.length}</p>{" "}
                          <p>Views: {product.viewedBy.length}</p>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="m-1 inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            <Edit3 size={16} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteProduct(product)}
                            className="m-1 inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            <Trash2 size={16} className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Prev
            </button>
            <span className="mx-4 text-white">
              {page}/{maxPage}
            </span>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
            >
              Next
            </button>
          </div>

          {/* Add Product Modal */}
          {open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Add New Product
                </h3>

                <form className="space-y-4" onSubmit={addProduct}>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                        min={0}
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Product Photos
                    </label>

                    {/* File Input */}
                    <input
                      type="file"
                      name="image"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-gray-200 cursor-pointer"
                    />

                    {/* Show selected files */}
                    {formData.image.length > 0 && (
                      <>
                        <p className="text-sm text-gray-400 mt-1">
                          {formData.image.length} file(s) selected
                        </p>
                        <ul className="mt-2 space-y-1">
                          {formData.image.map((file, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-400 flex justify-between items-center bg-gray-800 px-3 py-1 rounded"
                            >
                              <span>{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemove(index)} // ✅ FIXED this line
                                className="text-red-500 hover:text-red-300 hover:scale-110 transition cursor-pointer"
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat[0].toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
{/* 
                  {formData.category === "other" && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Other Category
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                      />
                    </div>
                  )} 
*/}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {editProduct && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Edit Product
                </h3>

                <form className="space-y-4" onSubmit={handleEditProduct}>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editProduct.name}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={editProduct.description}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editProduct.price}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                        min={0}
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={editProduct.quantity}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditProduct(null)}
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Product Modal */}
          {deleteProduct && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Confirm Delete Product
                </h3>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deleteProduct.name}
                    onChange={handleChange}
                    className="cursor-not-allowed w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                    disabled
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setDeleteProduct(null)}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDelete()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
