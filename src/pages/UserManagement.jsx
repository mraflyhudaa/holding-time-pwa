import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../services/userManagementService.js";
import { createUser } from "../services/userManagementService.js";
import { useAuth } from "../context/AuthContext.jsx";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    username: "",
    name: "",
    password: "",
    hhb: "",
    role: "",
  });
  const [addFormData, setAddFormData] = useState({
    username: "",
    name: "",
    password: "",
    hhb: "",
    role: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { user } = useAuth();

  const itemsPerPage = 5;

  const debouncedFetchUsers = useMemo(
    () =>
      debounce(async (term) => {
        setIsLoading(true);
        try {
          const fetchedUsers = await getUsers(term);
          setUsers(fetchedUsers.users);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  u;

  useEffect(() => {
    debouncedFetchUsers(searchTerm);
  }, [searchTerm, debouncedFetchUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditUser = (userData) => {
    setEditFormData({
      id: userData.id,
      username: userData.username,
      namme: userData.name,
      password: "",
      hhb: userData.hhb,
      role: userData.role,
    });
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
    try {
      await updateUser(editFormData.id, editFormData);
      document.getElementById("edit_modal").close();
      debouncedFetchUsers(searchTerm);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setAddFormData({
      username: "",
      name: "",
      password: "",
      hhb: user.hhb || "", // Set the HHB from the authenticated user
      role: "",
    });
    document.getElementById("add_modal").showModal();
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    try {
      await createUser(addFormData);
      document.getElementById("add_modal").close();
      debouncedFetchUsers(searchTerm);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // console.log(userToDelete.id);
      await deleteUser(userToDelete.id);
      setShowDeleteModal(false);
      debouncedFetchUsers(searchTerm);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { currentItems, indexOfLastItem } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: users.slice(indexOfFirstItem, indexOfLastItem),
      indexOfLastItem,
    };
  }, [currentPage, users]);

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
            onClick={() => debouncedFetchUsers(searchTerm)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleAddUser}>
          Add User
        </button>
      </div>
      <table className="table w-full border table-zebra">
        <thead className="text-lg bg-slate-300 text-black">
          <tr>
            <th>Username</th>
            <th>HHB</th>
            <th>Role</th>
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
          {currentItems.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.hhb}</td>
              <td>{user.role}</td>
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
                      <a onClick={() => handleEditUser(user)}>Edit</a>
                    </li>
                    <li>
                      <a onClick={() => handleDeleteUser(user)}>Delete</a>
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
            disabled={indexOfLastItem >= users.length}
          >
            Next &gt;
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(Math.ceil(users.length / itemsPerPage))}
            disabled={indexOfLastItem >= users.length}
          >
            Last &gt;&gt;
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit User</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleEditFormChange}
                className="input input-bordered"
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
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditFormChange}
                className="input input-bordered"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">HHB</span>
              </label>
              <input
                type="text"
                name="hhb"
                value={editFormData.hhb}
                onChange={handleEditFormChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={editFormData.role}
                onChange={handleEditFormChange}
                className="select select-bordered"
              >
                <option value="">Select a role</option>
                {/* <option value="admin">Admin</option> */}
                <option value="user">Store</option>
                <option value="storeadmin">Store Admin</option>
              </select>
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
          <h3 className="font-bold text-lg">Add User</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={addFormData.username}
                onChange={handleAddFormChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={addFormData.name}
                onChange={handleAddFormChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={addFormData.password}
                onChange={handleAddFormChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">HHB</span>
              </label>
              <input
                type="text"
                name="hhb"
                value={addFormData.hhb}
                onChange={handleAddFormChange}
                className="input input-bordered"
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={addFormData.role}
                onChange={handleAddFormChange}
                className="select select-bordered"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="storeadmin">Store Admin</option>
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleConfirmAdd}>
              {isLoading ? "Adding..." : "Add User"}
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
              Are you sure you want to delete the user "{userToDelete.username}
              "?
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

export default UserManagement;
