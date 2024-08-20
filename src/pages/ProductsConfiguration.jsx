import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getProductThresholds,
  updateProductThresholds,
} from "../services/productConfigService";
import { debounce } from "lodash";
import TimeField from "react-simple-timefield";

const ProductsConfiguration = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    noitem: "",
    name: "",
    max_holding_time: "",
    expired_threshold: "",
    warning_threshold: "",
    primary_threshold: "",
  });
  const [originalData, setOriginalData] = useState({});
  const itemsPerPage = 5;

  const debouncedFetchProducts = useMemo(
    () =>
      debounce(async (term) => {
        setIsLoading(true);
        try {
          const products = await getProductThresholds(term);
          setProducts(products);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchProducts(searchTerm);
  }, [searchTerm, debouncedFetchProducts]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      noitem: product.noitem,
      name: product.name,
      max_holding_time: product.max_holding_time,
      expired_threshold: product.expired_threshold,
      warning_threshold: product.warning_threshold,
      primary_threshold: product.primary_threshold,
    });
    setOriginalData(product);
    document.getElementById("edit_modal").showModal();
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirmEdit = async () => {
    setIsLoading(true);
    const changes = Object.keys(editFormData).reduce((acc, key) => {
      if (editFormData[key] !== originalData[key]) {
        acc[key] = editFormData[key];
      }
      return acc;
    }, {});

    if (Object.keys(changes).length === 0) {
      document.getElementById("edit_modal").close();
      setIsLoading(false);
      return;
    }

    try {
      await updateProductThresholds(selectedProduct.id, changes);
      document.getElementById("edit_modal").close();
      debouncedFetchProducts(searchTerm); // Refresh data
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { currentItems, indexOfLastItem } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: products.slice(indexOfFirstItem, indexOfLastItem),
      indexOfLastItem,
    };
  }, [currentPage, products]);

  return (
    <div className="px-4 pt-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="SEARCH"
          className="w-full max-w-xs input input-bordered"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="ml-2 btn btn-primary"
          onClick={() => debouncedFetchProducts(searchTerm)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
      <table className="table w-full border table-zebra">
        <thead className="text-lg bg-slate-300 text-black">
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Max Lifetime</th>
            <th>Red</th>
            <th>Yellow</th>
            {/* <th>Green</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No data
              </td>
            </tr>
          )}
          {currentItems.map((product, index) => (
            <tr key={index}>
              <td>{product.noitem}</td>
              <td>{product.name}</td>
              <td>{product.max_holding_time}</td>
              <td>{product.expired_threshold}</td>
              <td>{product.warning_threshold}</td>
              {/* <td>{product.primary_threshold}</td> */}
              <td>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost rounded-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="h-6 w-6 stroke-current"
                    >
                      <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
                  >
                    <li>
                      <a onClick={() => handleEditProduct(product)}>Edit</a>
                    </li>
                    {/* <li>
                      <a
                      // onClick={() => handleDeleteProduct(product.name)}
                      >
                        Delete
                      </a>
                    </li> */}
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex mt-4">
        <div className="grid grid-cols-4 join">
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(1)}
          >
            &lt;&lt; First
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= products.length}
          >
            Next &gt;
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(Math.ceil(products.length / itemsPerPage))}
            disabled={indexOfLastItem >= products.length}
          >
            Last &gt;&gt;
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Product</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">No Item</span>
              </label>
              <input
                type="text"
                name="noitem"
                value={editFormData.noitem}
                onChange={handleEditFormChange}
                className="input input-bordered"
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                className="input input-bordered"
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Lifetime</span>
              </label>
              {/* <input
                type="text"
                name="max_holding_time"
                value={editFormData.max_holding_time}
                onChange={handleEditFormChange}
                className="input input-bordered"
              /> */}
              <TimeField
                name="max_holding_time"
                value={editFormData.max_holding_time}
                onChange={handleEditFormChange}
                colon=":"
                showSeconds
                input={
                  <input
                    name="max_holding_time"
                    type="text"
                    className="input input-bordered"
                  />
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Low</span>
              </label>
              <input
                type="text"
                name="expired_threshold"
                value={editFormData.expired_threshold}
                onChange={handleEditFormChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Medium</span>
              </label>
              <input
                type="text"
                name="warning_threshold"
                value={editFormData.warning_threshold}
                onChange={handleEditFormChange}
                className="input input-bordered"
              />
            </div>
            {/* <div className="form-control">
              <label className="label">
                <span className="label-text">High</span>
              </label>
              <input
                type="text"
                name="primary_threshold"
                value={editFormData.primary_threshold}
                onChange={handleEditFormChange}
                className="input input-bordered"
              />
            </div> */}
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleConfirmEdit}>
              {isLoading ? "Saving..." : "Save changes"}
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductsConfiguration;
