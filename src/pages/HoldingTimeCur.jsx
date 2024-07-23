import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddProductModal from "../component/AddProductModal";
// import ProductForm from "../../ProductForm";

const initialMenuItems = [
  { name: "Egg Roll", qty: 60, uom: "pcs", kelompok: "#1", lifeTime: "05:17" },
  {
    name: "Beef Teriyaki",
    qty: 20,
    uom: "Porsi",
    kelompok: "#1",
    lifeTime: "14:32",
  },
  { name: "Ebi Furai", qty: 30, uom: "pcs", kelompok: "#1", lifeTime: "25:07" },
  {
    name: "Ramen Hokaido Misso",
    qty: 2,
    uom: "Porsi",
    kelompok: "#1",
    lifeTime: "29:55",
  },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
];

const HoldingTimeCur = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/holding-time"
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const addProduct = async (product) => {
    try {
      await axios.post("http://localhost:8080/api/holding-time", {
        name: product.name,
        qty: product.qty,
        uom: product.uom,
        max_holding_time: product.max_holding_time,
      });
      fetchMenuItems(); // Refresh the list after adding
      setIsModalOpen(false); // Close the modal after adding
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/api/holding-time/${id}`, {
        name: updatedData.name,
        qty: updatedData.qty,
        uom: updatedData.uom,
        max_holding_time: updatedData.lifeTime,
      });
      fetchMenuItems(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/holding-time/${id}`);
      fetchMenuItems(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/holding-time?search=${searchTerm}`
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="SEARCH"
          className="w-full max-w-xs input input-bordered"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="ml-2 btn btn-primary" onClick={handleSearch}>
          Submit
        </button>
        <button
          className="ml-2 btn btn-secondary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>
      <table className="table w-full text-lg border table-zebra">
        <thead className="text-lg">
          <tr>
            <th>Item komposisi/ Menu</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Kelompok</th>
            <th>Life Time</th>
            <th>Config</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.uom}</td>
              <td>{item.kelompok}</td>
              <td className={getLifeTimeColor(item.lifeTime)}>
                {item.lifeTime}
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdate(item.id, item)}
                >
                  Update
                </button>
                <button
                  className="ml-2 btn btn-error"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
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
            disabled={indexOfLastItem >= menuItems.length}
          >
            Next &gt;
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(Math.ceil(menuItems.length / itemsPerPage))}
            disabled={indexOfLastItem >= menuItems.length}
          >
            Last &gt;&gt;
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Link className="btn btn-primary" to={"/"}>
          DISPLAY HOLDING TIME
        </Link>
        <Link className="btn btn-info" to={"/pdlc"}>
          PDLC
        </Link>
        <button className="btn btn-warning">RMLC</button>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addProduct={addProduct}
      />
    </div>
  );
};
const getLifeTimeColor = (lifeTime) => {
  const [hours, minutes, seconds] = lifeTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  if (totalMinutes < 10) return "text-red-500";
  if (totalMinutes < 20) return "text-yellow-500";
  return "text-green-500";
};

export default HoldingTimeCur;
