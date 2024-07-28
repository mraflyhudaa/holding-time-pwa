import React, { useState, useEffect, useCallback } from "react";
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
  const [blinkStates, setBlinkStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;

  const processedItemIds = new Set();

  const calculateRemainingTime = useCallback((item, currentTime) => {
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
  }, []);

  const fetchMenuItems = useCallback(
    async (search = "") => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/holding-time${
            search ? `?search=${search}` : ""
          }`
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
      } finally {
        setIsLoading(false);
      }
    },
    [calculateRemainingTime]
  );

  const insertWasteItem = async (item) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/waste-items",
        {
          name: item.name,
          qty: item.qty,
          uom: item.uom,
          start_time: item.startTime,
          end_time: new Date().getTime(),
        }
      );
      console.log("Waste item inserted:", response.data);
    } catch (error) {
      console.error("Error inserting waste item:", error);
    }
  };

  const updateLifeTimes = useCallback(() => {
    const currentTime = new Date().getTime();
    setMenuItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        const updatedItem = calculateRemainingTime(item, currentTime);
        if (
          updatedItem.lifeTime === "00:00:00" &&
          !processedItemIds.has(item.id) &&
          item.status !== "expired"
        ) {
          console.log(item.id);
          axios
            .put(`http://localhost:8080/api/holding-time/expire/${item.id}`)
            .then((response) => {
              console.log("Marked as expired:", response.data);
            })
            .catch((error) => {
              console.error("Error marking as expired:", error);
            });
          insertWasteItem(updatedItem);
          processedItemIds.add(item.id);
        }
        return updatedItem;
      });
      return sortItemsByLifeTime(updatedItems);
    });
  }, [calculateRemainingTime]);

  useEffect(() => {
    fetchMenuItems();
    const intervalId = setInterval(updateLifeTimes, 1000);
    return () => clearInterval(intervalId);
  }, [fetchMenuItems, updateLifeTimes]);

  useEffect(() => {
    processedItemIds.clear();
  }, [menuItems]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkStates((prevStates) => {
        const newStates = { ...prevStates };
        menuItems.forEach((item) => {
          if (item.lifeTime === "00:00:00") {
            newStates[item.id] = !prevStates[item.id];
          }
        });
        return newStates;
      });
    }, 500);

    return () => clearInterval(blinkInterval);
  }, [menuItems]);

  const addProduct = async (product) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/holding-time/${id}`, {
        name: updatedData.name,
        qty: updatedData.qty,
        uom: updatedData.uom,
        lifeTime: updatedData.lifeTime,
      });
      await fetchMenuItems();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:8080/api/holding-time/${id}`);
      await fetchMenuItems();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = async () => {
    fetchMenuItems(searchTerm);
  };

  const getLifeTimeColor = (lifeTime, itemId) => {
    const [hours, minutes, seconds] = lifeTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;

    if (totalMinutes === 0) {
      return `badge badge-lg badge-error ${
        blinkStates[itemId] ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`;
    }
    if (totalMinutes < 1) return "badge badge-lg badge-error";
    if (totalMinutes < 20) return "badge badge-lg badge-warning";
    return "badge badge-lg badge-primary";
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
        <button
          className="ml-2 btn btn-primary"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Submit"
          )}
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
          {isLoading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <span className="loading loading-spinner loading-lg"></span>
              </td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.uom}</td>
                <td>{item.kelompok}</td>
                <td>
                  <p className={getLifeTimeColor(item.lifeTime, item.id)}>
                    {item.lifeTime}
                  </p>
                </td>
                <td>
                  {item.lifeTime == "00:00:00" && (
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
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
      <AddProductModal addProduct={addProduct} isLoading={isLoading} />
    </div>
  );
};

export default HoldingTimeCur;
