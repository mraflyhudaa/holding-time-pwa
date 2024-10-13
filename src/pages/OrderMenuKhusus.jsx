import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import ConfirmationModal from "../component/ConfirmationModal.jsx";
import { getSpecialProductThresholds } from "../services/productConfigService.js";
import { convertToMilliseconds } from "../utils/convertToMilliseconds.js";
import {
  deleteOrderSpecialItem,
  getOrderSpecialItems,
  updateOrderSpecialItemStatus,
} from "../services/orderMenuKhusus.js";
import { formatTime } from "../utils/formatTime.js";
import { sortItemsByLifeTime } from "../utils/sortItemsByLifetime.js";
import { toast } from "react-toastify";

const OrderMenuKhusus = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [itemComplete, setItemComplete] = useState(null);
  const [productConfigs, setProductConfigs] = useState({});

  const [blinkStates, setBlinkStates] = useState({});

  const processedItemIds = useMemo(() => new Set(), []);

  const itemsPerPage = 5;

  const fetchProductConfigs = useCallback(async () => {
    try {
      const configs = await getSpecialProductThresholds();
      setProductConfigs(configs);
      console.log("Product Configs:", configs);
    } catch (error) {
      console.error("Error fetching product configs:", error);
    }
  }, []);

  useEffect(() => {
    fetchProductConfigs();
  }, [fetchProductConfigs]);

  const calculateRemainingTime = useCallback((item, currentTime) => {
    const elapsedTime = currentTime - item.cooking_start_time;
    const initialLifeTimeMs = convertToMilliseconds(
      item.initialLifeTime || item.cooking_time
    );
    const remainingTime = Math.max(initialLifeTimeMs - elapsedTime, 0);
    return {
      ...item,
      remainingTimeMs: remainingTime,
      cooking_time: formatTime(remainingTime),
    };
  }, []);

  const fetchItems = useCallback(
    async (search = "") => {
      try {
        const response = await getOrderSpecialItems(search);
        const currentTime = new Date().getTime();
        console.log(response);
        const items = response.data.map((item) => ({
          ...item,
          initialLifeTime: item.cooking_time,
          cooking_start_time: item.cooking_start_time || currentTime,
        }));
        const calculatedItems = items.map((item) =>
          calculateRemainingTime(item, currentTime)
        );
        setMenuItems(sortItemsByLifeTime(calculatedItems));
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    },
    [calculateRemainingTime]
  );

  const debouncedFetchMenuItems = useMemo(
    () => debounce(fetchItems, 300),
    [fetchItems]
  );

  const updateLifeTimes = useCallback(() => {
    const currentTime = new Date().getTime();
    setMenuItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        const updatedItem = calculateRemainingTime(item, currentTime);

        const itemUpdatedAt = new Date(item.updated_at).getTime();
        const elapsedTime = currentTime - itemUpdatedAt;
        const cookingTimeInMs = convertToMilliseconds(updatedItem.cooking_time);

        // Removed status update and deletion logic

        return updatedItem;
      });
      return sortItemsByLifeTime(updatedItems);
    });
  }, [calculateRemainingTime]);

  useEffect(() => {
    if (!searchTerm) {
      fetchItems();
    }
    const pollingInterval = setInterval(() => {
      if (!searchTerm) {
        fetchItems();
      }
    }, 5000);

    const timerInterval = setInterval(() => {
      updateLifeTimes();
    }, 1000); // Update the timer every second

    return () => {
      clearInterval(pollingInterval);
      clearInterval(timerInterval);
    };
  }, [fetchItems, updateLifeTimes, searchTerm]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkStates((prevStates) => {
        const newStates = { ...prevStates };
        menuItems.forEach((item) => {
          if (item.cooking_time === "00:00:00") {
            newStates[item.id] = !prevStates[item.id];
          }
        });
        return newStates;
      });
    }, 500);

    return () => clearInterval(blinkInterval);
  }, [menuItems]);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const sortedMenuItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);

      // if (sortDirection === "asc") {
      //   return dateA - dateB;
      // } else {
      return dateB - dateA;
      // }
    });
  }, [menuItems, sortDirection]);

  const { currentItems, indexOfLastItem } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: sortedMenuItems.slice(indexOfFirstItem, indexOfLastItem),
      indexOfLastItem,
    };
  }, [currentPage, sortedMenuItems]);

  const handleCompleteModal = (id) => {
    setItemComplete(id);
    console.log(id);
    console.log(itemComplete);
    document.getElementById("confirmation_modal").showModal();
  };

  const handleMarkAsComplete = useCallback(
    async (event) => {
      event.preventDefault(); // Prevent form submission
      if (itemComplete) {
        console.log(itemComplete);
        try {
          const response = await updateOrderSpecialItemStatus(itemComplete);
          setMenuItems(menuItems.filter((item) => item.id !== itemComplete));
          await deleteOrderSpecialItem(itemComplete);
          toast.success("Items successfuly updated", {
            position: "top-right",
            autoClose: 1000,
          });
        } catch (error) {
          console.error("Failed to update item status:", error);
        } finally {
          setItemComplete(null);
          document.getElementById("confirmation_modal").close();
        }
      }
    },
    [itemComplete, menuItems]
  );

  const handleSearch = useCallback(() => {
    debouncedFetchMenuItems(searchTerm);
  }, [debouncedFetchMenuItems, searchTerm]);

  const getLifeTimeColor = useCallback(
    (lifeTime, itemNo, itemId) => {
      const [hours, minutes, seconds] = lifeTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + seconds / 60;

      const config = productConfigs.find((c) => c.noitem === itemNo) || {};
      const expiredThreshold = parseInt(config.expired_threshold) || 0;
      const warningThreshold = parseInt(config.warning_threshold) || 3;
      const primaryThreshold = parseInt(config.primary_threshold) || 10;

      let className;
      if (totalMinutes === 0) {
        className = `text-lg badge badge-lg badge-error ${
          blinkStates[itemId] ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`;
      } else if (totalMinutes <= expiredThreshold) {
        className = "text-lg badge badge-lg ";
      } else if (totalMinutes <= warningThreshold) {
        className = "text-lg badge badge-lg ";
      } else {
        className = "text-lg badge badge-lg ";
      }

      // console.log("Life Time Color Class:", className);
      return className;
    },
    [blinkStates, productConfigs]
  );

  return (
    <div className="px-4 pt-4">
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
      </div>

      <table className="table w-full border table-zebra">
        <thead className="text-lg bg-slate-300 text-black">
          <tr>
            {/* <th>No Item</th>
            <th>Item</th> */}
            <th>No PLU</th>
            <th>PLU</th>
            {/* <th>Qty Porsi</th> */}
            <th>Qty</th>
            <th>UOM</th>
            <th>Type</th>
            <th>Cooking Time</th>
            <th>Status</th>
            <th>Date</th>
            {/* <th>
              <button onClick={toggleSortDirection}>
                Updated At {sortDirection === "asc" ? "▲" : "▼"}
              </button>
            </th> */}
            <th>Tools</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No items found
              </td>
            </tr>
          )}
          {currentItems.map((item, index) => (
            <tr key={index}>
              {/* <td>{item.noitem}</td>
              <td>{item.name}</td> */}
              <td>{item.plu}</td>
              <td>{item.name}</td>
              {/* <td>{item.qty_portion}</td> */}
              <td>{item.qty}</td>
              <td>{item.uom}</td>
              <td>{item.item_type}</td>
              <td>
                <p
                  className={getLifeTimeColor(
                    item.cooking_time,
                    item.noitem,
                    item.id
                  )}
                >
                  {item.cooking_time}
                </p>
              </td>
              <td>{item.status === "finished" ? "Done" : "Pending"}</td>
              <td>{new Date(item.created_at).toLocaleString("id")}</td>
              <td>
                <button
                  className="btn btn-outline"
                  onClick={() => handleCompleteModal(item.id)}
                  disabled={item.status === "finished"}
                >
                  {item.status === "finished" ? "Finished" : "Mark as Finished"}
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
            disabled={currentPage === 1}
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
      <ConfirmationModal
        title="Mark As Complete"
        description="Are you sure you want to mark this item as finished?"
        handle={handleMarkAsComplete}
        buttonName="Finish"
      />
    </div>
  );
};

export default React.memo(OrderMenuKhusus);
