import React, { useState, useEffect } from "react";
import { getProductsConfig } from "../services/productConfigService";

const ProductsConfiguration = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await getProductsConfig();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Products Configuration</h1>
      <table className="table w-full border table-zebra">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Max Lifetime (Date)</th>
            <th>Expiry Threshold</th>
            <th>Warning Threshold</th>
            <th>Primary Thresholds</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.maxLifetime}</td>
              <td>{product.expiryThreshold}</td>
              <td>{product.warningThreshold}</td>
              <td>{product.primaryThresholds}</td>
              <td>
                <button className="btn btn-primary">Edit</button>
                <button className="btn btn-primary">View</button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDeleteProduct(product.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedProduct}?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-primary mr-2"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsConfiguration;
