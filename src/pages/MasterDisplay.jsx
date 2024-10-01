import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import {
  createMasterDisplay,
  deleteMasterDisplay,
  getMasterDisplay,
  updateMasterDisplay,
} from "../services/masterDisplayService";

const MasterDisplay = () => {
  const [masterData, setMasterData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    description: "",
    aktif: "0",
  });
  const [addFormData, setAddFormData] = useState({
    description: "",
    aktif: "0",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const itemsPerPage = 5;

  const debouncedFetchMasterData = useMemo(
    () =>
      debounce(async (term) => {
        setIsLoading(true);
        try {
          const fetchedData = await getMasterDisplay(term);
          setMasterData(fetchedData);
        } catch (error) {
          console.error("Error fetching master data:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchMasterData(searchTerm);
  }, [searchTerm, debouncedFetchMasterData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditItem = (item) => {
    setEditFormData({
      id: item.id,
      description: item.description,
      aktif: item.aktif,
    });
    document.getElementById("edit_modal").showModal();
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleConfirmEdit = async () => {
    setIsLoading(true);
    try {
      await updateMasterDisplay(editFormData.id, editFormData);
      console.log(editFormData);
      document.getElementById("edit_modal").close();
      debouncedFetchMasterData(searchTerm);
    } catch (error) {
      console.error("Error updating master data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setAddFormData({
      description: "",
      aktif: "0",
    });
    document.getElementById("add_modal").showModal();
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    try {
      await createMasterDisplay(addFormData);
      document.getElementById("add_modal").close();
      debouncedFetchMasterData(searchTerm);
    } catch (error) {
      console.error("Error adding master data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteMasterDisplay(itemToDelete.id);
      setShowDeleteModal(false);
      debouncedFetchMasterData(searchTerm);
    } catch (error) {
      console.error("Error deleting master data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { currentItems, indexOfLastItem } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: masterData.slice(indexOfFirstItem, indexOfLastItem),
      indexOfLastItem,
    };
  }, [currentPage, masterData]);

  return (
    <div className="px-4 pt-4">
      <div className="flex mb-4 justify-between">
        <div className="flex flex-row space-x-2">
          <input
            type="text"
            placeholder="SEARCH"
            className="w-full max-w-xs input input-bordered"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="ml-2 btn btn-primary"
            onClick={() => debouncedFetchMasterData(searchTerm)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
      <table className="table w-full border table-zebra">
        <thead className="text-lg bg-slate-300 text-black">
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No data
              </td>
            </tr>
          )}
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{masterData.indexOf(item) + 1}</td>
              <td>{item.description}</td>
              <td>{item.aktif === "1" ? "Yes" : "No"}</td>
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
                      <a onClick={() => handleEditItem(item)}>Edit</a>
                    </li>
                    <li>
                      <a onClick={() => handleDeleteItem(item)}>Delete</a>
                    </li>
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
            disabled={indexOfLastItem >= masterData.length}
          >
            Next &gt;
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() =>
              paginate(Math.ceil(masterData.length / itemsPerPage))
            }
            disabled={indexOfLastItem >= masterData.length}
          >
            Last &gt;&gt;
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Master Data</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                className="textarea textarea-bordered"
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  name="aktif"
                  checked={editFormData.aktif === "1"}
                  onChange={handleEditFormChange}
                  className="checkbox"
                />
              </label>
            </div>
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

      {/* Add Modal */}
      <dialog id="add_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Master Data</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={addFormData.description}
                onChange={handleAddFormChange}
                className="textarea textarea-bordered"
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  name="aktif"
                  checked={addFormData.aktif === "1"}
                  onChange={handleAddFormChange}
                  className="checkbox"
                />
              </label>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleConfirmAdd}>
              {isLoading ? "Adding..." : "Add Item"}
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete the item with ID "
              {itemToDelete.id}"?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDisplay;
