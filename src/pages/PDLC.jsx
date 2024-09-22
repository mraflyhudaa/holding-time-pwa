import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPDLCCalc } from "../services/pdlcService";
import { debounce } from "lodash";
import Table from "../component/Table";

const PDLC = () => {
  // const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [timePage, setTimePage] = useState(0);
  const [pdlcItems, setPdlcItems] = useState([]);

  const itemsPerPage = 5;
  const timesPerPage = 4;

  const fetchItemsPdlc = async (search = "") => {
    setIsLoading(true);
    try {
      const response = await getPDLCCalc(search);
      setPdlcItems(response.data);
      console.log("res", response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchItemsPdlc();
    }
  }, []);

  const debouncedFetchItems = useMemo(
    () => debounce(fetchItemsPdlc, 300),
    [fetchItemsPdlc]
  );

  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours();
  };

  // useEffect(() => {
  //   setTimePage(getCurrentHour());
  // }, []);

  const handleSearch = useCallback(() => {
    debouncedFetchItems(searchTerm);
  }, [debouncedFetchItems, searchTerm]);

  const indexOfLastTime = timePage + timesPerPage;
  const indexOfFirstTime = timePage;
  const indexOfLastPage = pdlcItems[0]?.times.length;
  console.log(indexOfLastPage);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const paginateTime = (pageNumber) => setTimePage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pdlcItems.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItems);

  if (isLoading) {
    return (
      <div className="px-4 pt-4">
        <div className="flex mb-4 justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex justify-between mb-4">
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
        <span className="ml-auto"></span>
      </div>
      {isLoading ? (
        "Fetching data"
      ) : (
        // <Table data={pdlcItems} />
        <table className="table w-full mb-4 text-lg border table-zebra">
          <thead className="text-lg bg-blue-300">
            <tr>
              <th>Item komposisi/ Menu</th>
              <th>Unit</th>
              <th>Qty</th>
              {Array.from({ length: timesPerPage }).map((_, i) => {
                const timeIdx = indexOfFirstTime + i;
                return (
                  <th key={timeIdx} colSpan={2} className="text-center">
                    {timeIdx < 24 ? currentItems[0].times[timeIdx].time : ""}
                    <br />
                    {timeIdx < 24
                      ? currentItems[0].times[timeIdx].classification
                      : ""}
                  </th>
                );
              })}
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              {Array.from({ length: timesPerPage }).map((_, i) => {
                const timeIdx = indexOfFirstTime + i;
                return (
                  <React.Fragment key={timeIdx}>
                    <th key={timeIdx + "min"} className="text-center">
                      Min
                    </th>
                    <th key={timeIdx + "max"} className="text-center">
                      Max
                    </th>
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.nmitem}</td>
                <td>{item.unit}</td>
                <td>{Math.trunc(item.calculated_qty)}</td>
                {item.times
                  .slice(indexOfFirstTime, indexOfLastTime)
                  .map((time, idx) => (
                    <React.Fragment key={idx}>
                      <td className="text-center">{Math.trunc(time.min)}</td>
                      <td className="text-center">{Math.trunc(time.max)}</td>
                    </React.Fragment>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between">
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
            disabled={indexOfLastItem >= pdlcItems.length}
          >
            Next &gt;
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginate(Math.ceil(pdlcItems.length / itemsPerPage))}
            disabled={indexOfLastItem >= pdlcItems.length}
          >
            Last &gt;&gt;
          </button>
        </div>
        <div className="grid grid-cols-2 join">
          <button
            className="join-item btn btn-outline"
            onClick={() => paginateTime(timePage - 1)}
            disabled={timePage === 0}
          >
            &lt; Prev Hour
          </button>
          <button
            className="join-item btn btn-outline"
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
