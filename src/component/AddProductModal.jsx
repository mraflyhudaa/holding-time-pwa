import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductModal = ({ isOpen, onClose, addProduct }) => {
  const [productData, setProductData] = useState({
    name: "",
    qty: "",
    uom: "",
    max_holding_time: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "name" && value) {
      const selectedProduct = products.find(
        (product) => product.name === value
      );
      if (selectedProduct) {
        setProductData((prevData) => ({
          ...prevData,
          uom: selectedProduct.uom,
          max_holding_time: selectedProduct.max_holding_time,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(productData);
    setProductData({ name: "", qty: "", uom: "", max_holding_time: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-3xl font-semibold">Add New Product</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative flex-auto p-6">
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="name"
                >
                  Food Item
                </label>
                <select
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  className="w-full max-w-xs select select-bordered"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="qty"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="qty"
                  name="qty"
                  value={productData.qty}
                  onChange={handleChange}
                  className="w-full max-w-xs input input-bordered"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="uom"
                >
                  UOM
                </label>
                <input
                  type="text"
                  id="uom"
                  name="uom"
                  value={productData.uom}
                  onChange={handleChange}
                  className="w-full max-w-xs input input-bordered"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="max_holding_time"
                >
                  Max Holding Time (minutes)
                </label>
                <input
                  type="text"
                  id="max_holding_time"
                  name="max_holding_time"
                  value={productData.max_holding_time}
                  onChange={handleChange}
                  className="w-full max-w-xs input input-bordered"
                  readOnly
                />
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
              <button className="btn btn-error" type="button" onClick={onClose}>
                Close
              </button>
              <button className="ml-2 btn btn-primary" type="submit">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
