import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { debounce, trim } from "lodash";
import AddProductModal from "../component/AddProductModal.jsx";
import { sortItemsByLifeTime } from "../utils/sortItemsByLifetime.js";
import { convertToMilliseconds } from "../utils/convertToMilliseconds.js";
import {
  createItemHoldingTime,
  deleteItemHoldingTime,
  getHoldingTime,
  updateStatusHoldingTime,
} from "../services/holdingTimeService.js";
import { createWasteItem } from "../services/wasteService.js";
import { getProductThresholds } from "../services/productConfigService.js";
import ConfirmationModal from "../component/ConfirmationModal.jsx";
import { formatTime } from "../utils/formatTime.js";

const HoldingTimeCur = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blinkStates, setBlinkStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productConfigs, setProductConfigs] = useState({});
  const [itemDelete, setItemDelete] = useState(null);
  const itemsPerPage = 5;

  const processedItemIds = useMemo(() => new Set(), []);

  const fetchProductConfigs = useCallback(async () => {
    try {
      const configs = await getProductThresholds();
      setProductConfigs(configs);
    } catch (error) {
      console.error("Error fetching product configs:", error);
    }
  }, []);

  useEffect(() => {
    fetchProductConfigs();
  }, [fetchProductConfigs]);

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
      }
    },
    [calculateRemainingTime]
  );

  const debouncedFetchMenuItems = useMemo(
    () => debounce(fetchMenuItems, 300),
    [fetchMenuItems]
  );

  const insertWasteItem = useCallback(async (item) => {
    try {
      const response = await createWasteItem(item);
      // console.log("Waste item inserted:", response);
    } catch (error) {
      console.error("Error inserting waste item:", error);
    }
  }, []);

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
  }, [calculateRemainingTime, insertWasteItem, processedItemIds]);

  useEffect(() => {
    if (!searchTerm) {
      fetchMenuItems();
    }
    const pollingInterval = setInterval(() => {
      if (!searchTerm) {
        fetchMenuItems();
      }
    }, 10000); // Poll every 5 seconds

    const timerInterval = setInterval(() => {
      updateLifeTimes();
    }, 1000); // Update the timer every second

    return () => {
      clearInterval(pollingInterval);
      clearInterval(timerInterval);
    };
  }, [fetchMenuItems, updateLifeTimes, searchTerm]);

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

  const addProduct = useCallback(
    async (item) => {
      setIsLoading(true);
      try {
        const response = await createItemHoldingTime(item);
        const currentTime = new Date().getTime();
        const newItem = calculateRemainingTime(
          {
            ...response.data,
            initialLifeTime: response.data.lifeTime,
            startTime: response.data.startTime || currentTime,
          },
          currentTime
        );

        setMenuItems((prevItems) =>
          sortItemsByLifeTime([...prevItems, newItem])
        );
      } catch (error) {
        console.error("Error adding product:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [calculateRemainingTime]
  );

  const handleDeleteModal = (id) => {
    // console.log("Deleting item:", id);
    setItemDelete(id);
    document.getElementById("confirmation_modal").showModal();
  };

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    // console.log("Deleting item:", itemDelete);
    try {
      await deleteItemHoldingTime(itemDelete);
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemDelete)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
      setItemDelete(null);
      document.getElementById("confirmation_modal").close();
    }
  }, [itemDelete]);

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
        className = "text-lg badge badge-lg badge-error";
      } else if (totalMinutes <= warningThreshold) {
        className = "text-lg badge badge-lg badge-warning";
      } else {
        className = "text-lg badge badge-lg badge-primary";
      }

      // console.log("Life Time Color Class:", className);
      return className;
    },
    [blinkStates, productConfigs]
  );

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const { currentItems, indexOfLastItem } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: menuItems.slice(indexOfFirstItem, indexOfLastItem),
      indexOfLastItem,
    };
  }, [currentPage, menuItems]);

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
            <td>Item </td>
            <td>Display</td>
            <td>Qty Porsi</td>
            <td>Qty</td>
            <td>UOM</td>
            <td>Kelompok</td>
            <td>Life Time</td>
            <td>Tools</td>
          </tr>
        </thead>
        <tbody className="text-lg">
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No items found
              </td>
            </tr>
          )}
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.display?.description}</td>
              <td>{item.uom.trim() == "pcs" ? "-" : item.qty_portion}</td>
              <td>{item.qty}</td>
              <td>{item.uom}</td>
              <td>{item.kelompok}</td>
              <td>
                <p
                  className={getLifeTimeColor(
                    item.lifeTime,
                    item.noitem,
                    item.id
                  )}
                >
                  {item.lifeTime}
                </p>
              </td>
              <td>
                {item.lifeTime == "00:00:00" && (
                  <button
                    className="btn btn-error text-lg"
                    // onClick={() => handleDelete(item.id)}
                    onClick={() => handleDeleteModal(item.id)}
                    disabled={isDeleting}
                  >
                    {item.qty != 0 || item.qty_portion != 0
                      ? "Waste"
                      : "Delete"}
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
      <Suspense fallback={<div>Loading...</div>}>
        <AddProductModal addProduct={addProduct} isLoading={isLoading} />
        <ConfirmationModal
          title="Delete Item"
          description="Are you sure you want to delete this item?"
          handle={handleDelete}
          buttonName="Delete"
        />
      </Suspense>
    </div>
  );
};

export default React.memo(HoldingTimeCur);
