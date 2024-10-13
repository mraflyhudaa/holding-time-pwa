import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import Table from "../component/Table";
import { sumQtyItemHoldingTime } from "../services/holdingTimeService";
import { getPDLCCalc } from "../services/pdlcService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PDLC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timePage, setTimePage] = useState(0);
  const [pdlcItems, setPdlcItems] = useState([]);
  const [lowQuantityItems, setLowQuantityItems] = useState({});
  const [time, setTime] = useState({});
  const [msg, setMsg] = useState(null);

  const itemsPerPage = 5;
  const timesPerPage = 4;
  const qtyThreshold = 5;

  const fetchItemsPdlc = async (search = "") => {
    setMsg(null);
    setIsLoading(true);
    try {
      const response = await getPDLCCalc(search);
      setPdlcItems(response.data);
      setTime(response.today);
      setIsLoading(false);
    } catch (error) {
      console.error("error", error);
      if (error.response && error.response.status === 404) {
        setMsg(
          "PDLC data not calculated today. Please click the button below to recalculate."
        );
        setIsError(true);
        toast.warning(
          "PDLC data not calculated today. Please calculate first.",
          {
            position: "top-right",
            autoClose: 1000,
          }
        );
      } else {
        setIsError(true);
        toast.error(
          "An error occurred while fetching data. Please try again.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLowQuantities = async () => {
    try {
      const quantities = await sumQtyItemHoldingTime();
      const lowItems = {};
      quantities.data.forEach((item) => {
        // console.log(item);
        if (item.total_qty < qtyThreshold) {
          lowItems[item.noitem] = true;
        }
      });
      setLowQuantityItems(lowItems);
    } catch (error) {
      console.error("Failed to fetch item quantities:", error);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchItemsPdlc();
    }
    fetchLowQuantities();

    const intervalId = setInterval(fetchLowQuantities, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const debouncedFetchItems = useMemo(
    () => debounce(fetchItemsPdlc, 300),
    [fetchItemsPdlc]
  );

  const handleSearch = useCallback(() => {
    debouncedFetchItems(searchTerm);
  }, [debouncedFetchItems, searchTerm]);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const paginateTime = (pageNumber) => setTimePage(pageNumber);

  const sortedItems = useMemo(() => {
    return [...pdlcItems].sort((a, b) => {
      if (lowQuantityItems[a.noitem] && !lowQuantityItems[b.noitem]) return -1;
      if (!lowQuantityItems[a.noitem] && lowQuantityItems[b.noitem]) return 1;
      return 0;
    });
  }, [pdlcItems, lowQuantityItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastTime = timePage + timesPerPage;
  const indexOfFirstTime = timePage;
  const indexOfLastPage = pdlcItems[0]?.times.length || 0;

  if (isLoading) {
    return (
      <div className="px-4 pt-4">
        <div className="flex mb-4 justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 pt-4">
        <div className="flex mb-4 justify-center items-center">
          {msg == null ? (
            <span className="">Error Fetching Data</span>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <span className="">{msg}</span>
              <Link className="btn btn-info" to={"/calculate-pdlc"}>
                CALCULATE PDLC
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex justify-between mb-4 items-center">
        <div className="flex">
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
        {time && (
          <span className="badge badge-lg text-xl badge-info p-4">{`${time.day}, ${time.date} (${time.type})`}</span>
        )}
      </div>
      {currentItems && (
        <Table
          data={currentItems}
          lowQuantityItems={lowQuantityItems}
          indexOfFirstTime={indexOfFirstTime}
          indexOfLastTime={indexOfLastTime}
        />
      )}

      <div className="flex justify-between mt-4">
        <div className="grid grid-cols-4 join">
          <button
            className="join-item btn btn-outline text-lg"
            onClick={() => paginate(1)}
          >
            &lt;&lt; First
          </button>
          <button
            className="join-item btn btn-outline text-lg"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <button
            className="join-item btn btn-outline text-lg"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= sortedItems.length}
          >
            Next &gt;
          </button>
          <button
            className="join-item btn btn-outline text-lg"
            onClick={() =>
              paginate(Math.ceil(sortedItems.length / itemsPerPage))
            }
            disabled={indexOfLastItem >= sortedItems.length}
          >
            Last &gt;&gt;
          </button>
        </div>
        <div className="grid grid-cols-2 join">
          <button
            className="join-item btn btn-outline text-lg"
            onClick={() => paginateTime(timePage - 1)}
            disabled={timePage === 0}
          >
            &lt; Prev Hour
          </button>
          <button
            className="join-item btn btn-outline text-lg"
            onClick={() => paginateTime(timePage + 1)}
            disabled={indexOfLastTime >= indexOfLastPage}
          >
            Next Hour &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDLC;
