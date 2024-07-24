import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddProductModal from "../component/AddProductModal";

const HoldingTimeCur = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMenuItems();
    const intervalId = setInterval(updateLifeTimes, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/holding-time"
      );
      const items = setupTimers(response.data);
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const setupTimers = (items) => {
    return items.map((item) => {
      const storedData = JSON.parse(localStorage.getItem(`timer_${item.id}`));
      if (storedData) {
        return {
          ...item,
          startTime: storedData.startTime,
          initialLifeTime: storedData.initialLifeTime,
        };
      } else {
        const newData = {
          startTime: new Date().getTime(),
          initialLifeTime: item.lifeTime,
        };
        localStorage.setItem(`timer_${item.id}`, JSON.stringify(newData));
        return {
          ...item,
          ...newData,
        };
      }
    });
  };

  const convertToMilliseconds = (time) => {
    if (!time || typeof time !== "string") {
      console.warn(`Invalid time format: ${time}`);
      return 0;
    }
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return ((hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
  };

  const updateLifeTimes = () => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => {
        const elapsedTime = new Date().getTime() - item.startTime;
        const remainingTime = Math.max(
          convertToMilliseconds(item.initialLifeTime) - elapsedTime,
          0
        );
        const updatedLifeTime = formatTime(remainingTime);

        localStorage.setItem(
          `timer_${item.id}`,
          JSON.stringify({
            startTime: item.startTime,
            initialLifeTime: item.initialLifeTime,
          })
        );

        return {
          ...item,
          lifeTime: updatedLifeTime,
        };
      })
    );
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return "00:00:00";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const addProduct = async (product) => {
    console.log("Adding product:", product);
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

      console.log("API response:", response.data);

      const newItem = {
        ...response.data.data,
        startTime: new Date().getTime(),
        initialLifeTime: response.data.data.lifeTime || "00:00:00",
      };

      console.log("New item to be added:", newItem);

      setMenuItems((prevItems) => [...prevItems, newItem]);
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
      const updatedItems = response.data.map((item) => ({
        ...item,
        targetTime: new Date().getTime() + convertToMilliseconds(item.lifeTime),
      }));
      setMenuItems(updatedItems);
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
              <td className={getLifeTimeColor(item.lifeTime)}>
                {item.lifeTime}
              </td>
              <td>
                <Link
                  to={`/products/${item.id}`}
                  className="mr-2 btn btn-primary"
                >
                  Update
                </Link>
                <button
                  className="btn btn-error"
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
      <AddProductModal addProduct={addProduct} />
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
