import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getOrderSpecialItems,
  updateOrderSpecialItemStatus,
} from "../services/orderMenuKhusus";
import { debounce } from "lodash";
import ConfirmationModal from "../component/ConfirmationModal";

const OrderMenuKhusus = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc"); // State for sorting direction
  const [itemComplete, setItemComplete] = useState(null);

  const itemsPerPage = 5;

  const fetchItems = useCallback(async () => {
    // setIsLoading(true);
    try {
      const items = await getOrderSpecialItems(searchTerm);
      console.log("items", items);
      setMenuItems(items);
    } catch (error) {
      console.error("Failed to fetch special items:", error);
    } finally {
      // setIsLoading(false);
    }
  }, [searchTerm]);

  const debouncedFetchMenuItems = useMemo(
    () => debounce(fetchItems, 300),
    [fetchItems]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchItems();
    }
    const pollingInterval = setInterval(() => {
      if (!searchTerm) {
        fetchItems();
      }
    }, 5000);
    return () => clearInterval(pollingInterval);
  }, [fetchItems, searchTerm]);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const sortedMenuItems = useMemo(() => {
    // Sort items by updated_at
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
    console.log("Mark as Complete item:", id);
    setItemComplete(id);
    document.getElementById("confirmation_modal").showModal();
  };

  const handleMarkAsComplete = useCallback(async () => {
    try {
      await updateOrderSpecialItemStatus(itemComplete);
      setMenuItems(
        menuItems.map((item) =>
          item.id === itemComplete ? { ...item, status: "finished" } : item
        )
      );
    } catch (error) {
      console.error("Failed to update item status:", error);
    } finally {
      setItemComplete(null);
      document.getElementById("confirmation_modal").close();
    }
  }, [itemComplete]);

  const handleSearch = useCallback(() => {
    debouncedFetchMenuItems(searchTerm);
  }, [debouncedFetchMenuItems, searchTerm]);

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

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
            <th>No Item</th>
            <th>Item Komposisi / Menu</th>
            <th>PLU</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Status</th>
            {/* <th>
              <button onClick={toggleSortDirection}>
                Updated At {sortDirection === "asc" ? "▲" : "▼"}
              </button>
            </th> */}
            <th>Tools</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.noitem}</td>
              <td>{item.name}</td>
              <td>{item.plu}</td>
              <td>{item.qty}</td>
              <td>{item.uom}</td>
              <td>{item.status === "finished" ? "Done" : "Pending"}</td>
              {/* <td>{new Date(item.updated_at).toLocaleString()}</td> */}
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

export default OrderMenuKhusus;
