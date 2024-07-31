import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddProductModal from "../component/AddProductModal";
import { formatTime } from "../utils/formatTime";
import { sortItemsByLifeTime } from "../utils/sortItemsByLifetime";
import { convertToMilliseconds } from "../utils/convertToMilliseconds";

import {
  createItemHoldingTime,
  deleteItemHoldingTime,
  getHoldingTime,
  updateStatusHoldingTime,
} from "../services/holdingTimeService";
import { createWasteItem } from "../services/wasteService";

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
        const response = await getHoldingTime(search);
        const currentTime = new Date().getTime();
        const items = response.map((item) => ({
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
      const response = await createWasteItem(item);
      console.log("Waste item inserted:", response);
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
          updateStatusHoldingTime(item)
            .then((response) => {
              console.log("Marked as expired:", response);
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

  const addProduct = async (item) => {
    setIsLoading(true);
    try {
      const response = await createItemHoldingTime(item);
      console.log(response);
      const currentTime = new Date().getTime();
      const newItem = calculateRemainingTime(
        {
          ...response.data,
          initialLifeTime: response.data.lifeTime,
          startTime: response.data.startTime || currentTime,
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

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await deleteItemHoldingTime(id);
      await fetchMenuItems();
      console.log("Item deleted:", response);
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
      return `text-lg badge badge-lg badge-error ${
        blinkStates[itemId] ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`;
    }
    if (totalMinutes < 1) return "text-lg badge badge-lg badge-error";
    if (totalMinutes < 20) return "text-lg badge badge-lg badge-warning";
    return "text-lg badge badge-lg badge-primary";
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
          Submit
        </button>
        <button
          className="ml-2 btn btn-secondary"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          Add Product
        </button>
      </div>

      <table className="table w-full border table-zebra">
        <thead className="text-lg bg-slate-300 text-black">
          <tr>
            <th>Item komposisi/ Menu</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Kelompok</th>
            <th>Life Time</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody className="text-lg">
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
                      className="btn btn-error text-lg"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                    >
                      Delete
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
      <AddProductModal addProduct={addProduct} isLoading={isLoading} />
      {/* <div className="flex justify-between mt-4">
        <Link className="btn btn-primary" to={"/"}>
          DISPLAY HOLDING TIME
        </Link>
        <Link className="btn btn-info" to={"/pdlc"}>
          PDLC
        </Link>
        <button className="btn btn-warning">RMLC</button>
        <button className="btn btn-warning">ORDER MENU KHUSUS</button>
      </div> */}
    </div>
  );
};

export default HoldingTimeCur;
