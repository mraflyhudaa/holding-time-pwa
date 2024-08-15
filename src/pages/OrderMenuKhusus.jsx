import React, { useCallback, useMemo, useState } from "react";

const OrderMenuKhusus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      </div>

      <table className="table w-full border table-zebra">
        <thead className="text-lg bg-slate-300 text-black">
          <tr>
            <th>Item komposisi/ Menu</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          {/* {currentItems.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No data
              </td>
            </tr>
          )}
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.uom}</td>
              <td>
                {item.lifeTime == "00:00:00" && (
                  <button
                    className="btn btn-error text-lg"
                    // onClick={() => handleDelete(item.id)}
                    onClick={() => handleDeleteModal(item.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))} */}
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
      {/* <AddProductModal addProduct={addProduct} isLoading={isLoading} /> */}
      {/* <DeleteModal handleDelete={handleDelete} /> */}
    </div>
  );
};

export default OrderMenuKhusus;
