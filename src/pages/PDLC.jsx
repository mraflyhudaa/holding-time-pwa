import React, { useState } from "react";
import { Link } from "react-router-dom";

const generateFullDayTimes = () => {
  const statuses = ["LOW", "MEDIUM", "HIGH", "SUPER"];
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    min: Math.floor(Math.random() * 10),
    max: 10 + Math.floor(Math.random() * 10),
  }));
};

const initialMenuItems = [
  {
    name: "Beef Teriyaki 1KG",
    unit: "Porsi",
    qty: 80,
    times: generateFullDayTimes(),
  },
  {
    name: "Chicken Teriyaki 1 KG",
    unit: "Porsi",
    qty: 73,
    times: generateFullDayTimes(),
  },
  {
    name: "Egg Chicken Roll",
    unit: "Ptg",
    qty: 537,
    times: generateFullDayTimes(),
  },
  {
    name: "Tori Ball",
    unit: "Pcs",
    qty: 135,
    times: generateFullDayTimes(),
  },
  {
    name: "HFC Marinasi Kecil",
    unit: "Pcs",
    qty: 3,
    times: generateFullDayTimes(),
  },
  {
    name: "HFC Marinasi Besar",
    unit: "Pcs",
    qty: 3,
    times: generateFullDayTimes(),
  },
  {
    name: "Ebi Furai",
    unit: "Pcs",
    qty: 77,
    times: generateFullDayTimes(),
  },
];

const itemsPerPage = 5;
const timesPerPage = 3;

const PDLC = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [timePage, setTimePage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateTime = (pageNumber) => setTimePage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastTime = timePage * timesPerPage;
  const indexOfFirstTime = indexOfLastTime - timesPerPage;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="SEARCH"
          className="w-full max-w-xs input input-bordered"
        />
        <button className="ml-2 btn btn-primary">Submit</button>
        <span className="ml-auto"></span>
      </div>
      <table className="table w-full mb-4 text-lg border table-zebra">
        <thead className="text-lg">
          <tr>
            <th>Item komposisi/ Menu</th>
            <th>Unit</th>
            <th>Qty</th>
            {Array.from(
              { length: timesPerPage },
              (_, i) => indexOfFirstTime + i
            ).map((timeIdx) => (
              <th key={timeIdx} colSpan={2} className="text-center">
                {timeIdx < 24 ? currentItems[0].times[timeIdx].time : ""}
                <br />
                {timeIdx < 24 ? currentItems[0].times[timeIdx].status : ""}
              </th>
            ))}
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            {Array.from(
              { length: timesPerPage },
              (_, i) => indexOfFirstTime + i
            ).map((timeIdx) => (
              <React.Fragment key={timeIdx}>
                <th key={timeIdx + "min"} className="text-center">
                  {timeIdx < 24 ? "MIN" : ""}
                </th>
                <th key={timeIdx + "max"} className="text-center">
                  {timeIdx < 24 ? "MAX" : ""}
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.unit}</td>
              <td>{item.qty}</td>
              {item.times
                .slice(indexOfFirstTime, indexOfLastTime)
                .map((time, idx) => (
                  <React.Fragment key={idx}>
                    <td className="text-center">{time.min}</td>
                    <td className="text-center">{time.max}</td>
                  </React.Fragment>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
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
        <div className="grid grid-cols-2 join">
          <button
            className="join-item btn btn-outline"
            onClick={() => paginateTime(timePage - 1)}
            disabled={timePage === 1}
          >
            &lt; Prev Hour
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => paginateTime(timePage + 1)}
            disabled={indexOfLastTime >= 24}
          >
            Next Hour &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDLC;
