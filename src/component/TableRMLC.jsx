import React from "react";

const TableRMLC = ({ data, indexOfFirstTime, indexOfLastTime }) => {
  const getClassification = (hour) => {
    const item = data[0]?.times[hour];
    return item ? item.classification : "";
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case "LOW":
        return "text-green-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "HIGH":
        return "text-orange-500";
      case "SUPER":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full mb-4 text-xl border table-zebra">
        <thead className="text-xl bg-accent text-white">
          <tr>
            <th>Menu</th>
            <th>Unit</th>
            <th>Qty</th>
            {Array.from({ length: indexOfLastTime - indexOfFirstTime }).map(
              (_, i) => {
                const timeIdx = indexOfFirstTime + i;
                const classification = getClassification(timeIdx);
                return (
                  <th key={timeIdx} colSpan={2} className="text-center">
                    {timeIdx < 24 ? data[0].times[timeIdx].time : ""}
                    <br />
                    <span className={getClassificationColor(classification)}>
                      {timeIdx < 24 ? classification : ""}
                    </span>
                  </th>
                );
              }
            )}
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            {Array.from({ length: indexOfLastTime - indexOfFirstTime }).map(
              (_, i) => (
                <React.Fragment key={i}>
                  <th className="text-center">Min</th>
                  <th className="text-center">Max</th>
                </React.Fragment>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.nmplu}</td>
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
    </div>
  );
};

export default TableRMLC;
