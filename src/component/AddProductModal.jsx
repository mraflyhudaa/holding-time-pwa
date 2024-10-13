/**
 * AddProductModal component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.addProduct - The function to add a new product.
 * @param {boolean} props.isLoading - Indicates if the component is in a loading state.
 * @returns {JSX.Element} The AddProductModal component.
 */
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { getProducts } from "../services/productService.js";
import { getMasterDisplay } from "../services/masterDisplayService.js";
import { getProductThresholds } from "../services/productConfigService.js";

const AddProductModal = ({ addProduct, isLoading }) => {
  const [productData, setProductData] = useState({
    noitem: "",
    name: "",
    qty_portion: "",
    uom: "",
    lifeTime: "",
  });
  const [calculatedQty, setCalculatedQty] = useState(""); // State for calculated quantity
  const [products, setProducts] = useState([]);
  const [display, setDisplay] = useState([]);
  const [options, setOptions] = useState([]);
  const [displayOptions, setDisplayOptions] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchDisplay();
  }, []);

  useEffect(() => {
    calculateQty(); // Recalculate qty whenever noitem or qty_portion changes
  }, [productData.noitem, productData.qty_portion]);

  const fetchProducts = async () => {
    try {
      const response = await getProductThresholds();
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

  const fetchDisplay = async () => {
    try {
      const response = await getMasterDisplay();
      setDisplay(response);
      const arr = response.map((d) => ({
        value: d.id,
        label: d.description,
      }));
      setDisplayOptions(arr);
    } catch (error) {
      console.error("Error fetching display:", error);
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

  const loadDisplayOptions = (inputValue) => {
    return new Promise((resolve) => {
      const filteredOptions = displayOptions.filter((option) =>
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

  const handleDisplayChange = (selectedOption) => {
    if (selectedOption) {
      setDisplay({
        id: selectedOption.value,
        description: selectedOption.label,
      });
    } else {
      setDisplay({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateQty = () => {
    const { noitem, qty_portion } = productData;
    const product = products.find((p) => p.noitem === noitem);
    if (product) {
      const baseQty = product.qty;
      const uom = product.uom;
      if (uom === "pcs" || uom === "ptg") {
        setCalculatedQty(qty_portion);
      } else {
        setCalculatedQty(baseQty * qty_portion);
      }
    } else {
      setCalculatedQty("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productData);
    try {
      addProduct({
        noitem: productData.noitem,
        name: productData.name,
        qty_portion: productData.qty_portion,
        uom: productData.uom,
        lifeTime: productData.lifeTime,
        display_id: display.id,
      });
      setProductData({
        noitem: "",
        name: "",
        qty_portion: "",
        uom: "",
        lifeTime: "00:00:00",
      });
      setDisplay({});
      setCalculatedQty(""); // Reset calculated quantity
      document.getElementById("my_modal_1").close();
    } catch (error) {
      console.error(error);
    }
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
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="qty_portion"
              >
                Quantity
              </label>
              <div className="grid grid-cols-2 items-center space-x-4">
                <input
                  type="numbet"
                  inputMode="numeric"
                  maxLength={2}
                  id="qty_portion"
                  name="qty_portion"
                  value={productData.qty_portion}
                  onChange={handleInputChange}
                  className="w-full max-w-full input input-bordered focus:input-secondary"
                  required
                />
                <label className="block text-sm font-bold text-gray-700 text-left">
                  Porsi
                </label>
              </div>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <div>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="calculatedQty"
                >
                  Calculated Quantity
                </label>
                <input
                  type="text"
                  id="calculatedQty"
                  name="calculatedQty"
                  value={calculatedQty}
                  className="w-full max-w-full input input-bordered focus:input-secondary"
                  readOnly
                />
              </div>
              <div>
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
                  className="w-full max-w-full input input-bordered focus:input-secondary"
                  readOnly
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="display"
              >
                Display
              </label>
              <AsyncSelect
                name="display_id"
                isSearchable
                cacheOptions
                loadOptions={loadDisplayOptions}
                defaultOptions={displayOptions}
                onChange={handleDisplayChange}
                value={
                  display.id
                    ? { value: display.id, label: display.description }
                    : null
                }
                className="w-full max-w-full focus:input-primary"
                styles={{
                  control: (styles) => ({ ...styles, height: "48px" }),
                }}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="lifeTime"
              >
                Max Holding Time (minutes)
              </label>
              <input
                type="text"
                id="lifeTime"
                name="lifeTime"
                value={productData.lifeTime}
                className="w-full max-w-full input input-bordered focus:input-secondary"
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
