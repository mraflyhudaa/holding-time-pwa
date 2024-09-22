import React from "react";

const Table = ({ data }) => {
  console.log(data);
  const allHours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const getClassification = (hour) => {
    const item = data[0]?.hourly_classification[hour];
    return item ? item.classification : "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">NO</th>
            <th className="border p-2">NAMA PRODUK</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">QTY PER HARI</th>
            {allHours.map((hour) => (
              <th key={hour} className="border p-2" colSpan="2">
                {hour}
                <br />
                <span className="text-xs font-normal">
                  {getClassification(hour)}
                </span>
              </th>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <th className="border p-2" colSpan="4"></th>
            {allHours.map((hour) => (
              <React.Fragment key={hour}>
                <th className="border p-2 text-xs">min</th>
                <th className="border p-2 text-xs">max</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.no}
              className={item.no % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="border p-2">{item.no}</td>
              <td className="border p-2">{item.nmitem}</td>
              <td className="border p-2">{item.unit}</td>
              <td className="border p-2">{item.calculated_qty}</td>
              {allHours.map((hour) => (
                <React.Fragment key={hour}>
                  <td className="border p-2">
                    {item.hourly_classification[hour]?.min || "-"}
                  </td>
                  <td className="border p-2">
                    {item.hourly_classification[hour]?.max || "-"}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
