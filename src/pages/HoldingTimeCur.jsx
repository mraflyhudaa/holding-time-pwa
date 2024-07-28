import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddProductModal from "../component/AddProductModal";
import { formatTime } from "../utils/formatTime";
import { sortItemsByLifeTime } from "../utils/sortItemsByLifetime";
import { convertToMilliseconds } from "../utils/convertToMilliseconds";

const HoldingTimeCur = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMenuItems();
    const intervalId = setInterval(updateLifeTimes, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const calculateRemainingTime = (item, currentTime) => {
    const elapsedTime = currentTime - item.startTime;
    const initialLifeTimeMs = convertToMilliseconds(
      item.initialLifeTime || item.lifeTime
    );
    const remainingTime = Math.max(initialLifeTimeMs - elapsedTime, 0);
    return {
      ...item,
      remainingTimeMs: remainingTime,
      lifeTime: formatTime(remainingTime),
    };
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/holding-time"
      );
      const currentTime = new Date().getTime();
      const items = response.data.map((item) => ({
        ...item,
        initialLifeTime: item.lifeTime,
        startTime: item.startTime || currentTime,
      }));
      const calculatedItems = items.map((item) =>
        calculateRemainingTime(item, currentTime)
      );
      setMenuItems(sortItemsByLifeTime(calculatedItems));
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const updateLifeTimes = () => {
    const currentTime = new Date().getTime();
    setMenuItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        calculateRemainingTime(item, currentTime)
      );
      return sortItemsByLifeTime(updatedItems);
    });
  };

  const addProduct = async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/holding-time",
        {
          name: product.name,
          qty: product.qty,
          uom: product.uom,
          lifeTime: product.lifeTime || "00:00:00",
        }
      );

      const currentTime = new Date().getTime();
      const newItem = calculateRemainingTime(
        {
          ...response.data.data,
          initialLifeTime: response.data.data.lifeTime,
          startTime: response.data.data.startTime || currentTime,
        },
        currentTime
      );

      setMenuItems((prevItems) => sortItemsByLifeTime([...prevItems, newItem]));
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
        lifeTime: updatedData.lifeTime,
      });
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/holding-time/${id}`);
      fetchMenuItems();
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
          onClick={() => document.getElementById("my_modal_1").showModal()}
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
              <td>
                <p className={getLifeTimeColor(item.lifeTime)}>
                  {item.lifeTime}
                </p>
              </td>
              <td>
                {/* <Link
                  to={`/products/${item.id}`}
                  className="mr-2 btn btn-primary"
                >
                  Update
                </Link> */}
                {item.lifeTime == "00:00:00" && (
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                )}
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
      <AddProductModal addProduct={addProduct} />
    </div>
  );
};
const getLifeTimeColor = (lifeTime) => {
  const [hours, minutes, seconds] = lifeTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  if (totalMinutes < 1) return "badge badge-lg badge-error";
  if (totalMinutes < 20) return "badge badge-lg badge-warning";
  return "badge badge-lg badge-primary";
};

export default HoldingTimeCur;
