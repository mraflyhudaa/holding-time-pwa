import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { getProducts } from "../services/productService";

const AddProductModal = ({ addProduct, isLoading }) => {
  const [productData, setProductData] = useState({
    noitem: "",
    name: "",
    qty: "",
    uom: "",
    lifeTime: "",
  });
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
      const arr = response.map((product) => ({
        value: product.noitem,
        label: product.name,
      }));
      setOptions(arr);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const loadOptions = (inputValue) => {
    return new Promise((resolve) => {
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      resolve(filteredOptions);
    });
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const selectedProduct = products.find(
        (product) => product.noitem === selectedOption.value
      );
      if (selectedProduct) {
        const lifeTime = selectedProduct.max_holding_time || "00:00:00";
        setProductData((prevData) => ({
          ...prevData,
          noitem: selectedOption.value,
          name: selectedProduct.name,
          uom: selectedProduct.uom,
          lifeTime: lifeTime,
        }));
      }
    } else {
      setProductData((prevData) => ({
        ...prevData,
        noitem: "",
        name: "",
        uom: "",
        lifeTime: "00:00:00",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      noitem: productData.noitem,
      name: productData.name,
      qty: productData.qty,
      uom: productData.uom,
      lifeTime: productData.lifeTime,
    });
    setProductData({
      noitem: "",
      name: "",
      qty: "",
      uom: "",
      lifeTime: "00:00:00",
    });
    document.getElementById("my_modal_1").close();
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Product</h3>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="py-4">
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="noitem"
              >
                Item Number
              </label>
              <AsyncSelect
                name="noitem"
                isSearchable
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions={options}
                onChange={handleSelectChange}
                value={
                  productData.noitem
                    ? { value: productData.noitem, label: productData.name }
                    : null
                }
                className="w-full max-w-full focus:input-primary"
                styles={{
                  control: (styles) => ({ ...styles, height: "48px" }),
                }}
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="qty"
              >
                Quantity
              </label>
              <input
                type="text"
                inputMode="numeric"
                id="qty"
                name="qty"
                value={productData.qty}
                onChange={handleInputChange}
                className="w-full max-w-full input input-bordered focus:input-secondary"
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
                onChange={handleInputChange}
                className="w-full max-w-full input input-bordered focus:input-primary"
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
                id="lifeTime"
                name="lifeTime"
                value={productData.lifeTime}
                className="w-full max-w-full input input-bordered focus:input-primary"
                readOnly
              />
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-error"
              type="button"
              onClick={() => document.getElementById("my_modal_1").close()}
            >
              Close
            </button>
            <button
              className="ml-2 btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddProductModal;
