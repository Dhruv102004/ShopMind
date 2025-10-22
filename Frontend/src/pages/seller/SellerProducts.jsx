import React, { useEffect, useState } from "react";
import { ClipboardCopy, Edit3 } from "lucide-react";
import SellerNavbar from "../../components/SellerNavbar";

export default function SellerProducts() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    photos: [],
    video: null,
  });

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [products, setProducts] = useState([
    {
      _id: "P001",
      name: "Wireless Mouse",
      description: "Smooth and precise wireless mouse",
      price: 499.99,
      quantity: 10,
    },
    {
      _id: "P002",
      name: "Keyboard",
      description: "Mechanical RGB keyboard with blue switches",
      price: 1599.0,
      quantity: 5,
    },
  ]);

  const getProducts = async () => {
    // Fetch products from backend (not implemented)
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    alert("Product ID copied!");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      setFormData({ ...formData, photos: Array.from(files) });
    } else if (name === "video") {
      setFormData({ ...formData, video: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files], // ✅ Append instead of replace
    }));
  };

  // Remove selected photo
  const handleRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Data:", formData);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      photos: [],
      video: null,
    });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-950 to-black">
      <SellerNavbar />

      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Your Products</h2>
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
                <th className="px-6 py-3 text-left">Product ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Quantity</th>
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
                      <span className="truncate max-w-[120px]">
                        {product._id}
                      </span>
                      <button
                        onClick={() => handleCopy(product._id)}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="Copy ID"
                      >
                        <ClipboardCopy size={16} />
                      </button>
                    </td>

                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4 truncate max-w-[250px] text-gray-400">
                      {product.description}
                    </td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">{product.quantity}</td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        <Edit3 size={16} className="mr-1" /> Edit
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
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
          Prev
        </button>
        <span className="mx-4 text-white">{page}/{maxPage}</span>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition" onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}>
          Next
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add New Product
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  name="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full text-gray-200 cursor-pointer"
                />

                {/* Show selected files */}
                {formData.photos.length > 0 && (
                  <>
                    <p className="text-sm text-gray-400 mt-1">
                      {formData.photos.length} file(s) selected
                    </p>
                    <ul className="mt-2 space-y-1">
                      {formData.photos.map((file, index) => (
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
                  Product Video
                </label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                  className="w-full text-gray-200"
                />
              </div>

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
    </div>
  );
}
