import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import ProductForm from "../../ProductForm";

const initialMenuItems = [
  { name: "Egg Roll", qty: 60, uom: "pcs", kelompok: "#1", lifeTime: "05:17" },
  {
    name: "Beef Teriyaki",
    qty: 20,
    uom: "Porsi",
    kelompok: "#1",
    lifeTime: "14:32",
  },
  { name: "Ebi Furai", qty: 30, uom: "pcs", kelompok: "#1", lifeTime: "25:07" },
  {
    name: "Ramen Hokaido Misso",
    qty: 2,
    uom: "Porsi",
    kelompok: "#1",
    lifeTime: "29:55",
  },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
  { name: "Ebi Furai", qty: 40, uom: "pcs", kelompok: "#2", lifeTime: "38:27" },
];

const HoldingTimeCur = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      parsedProducts.forEach((product) => {
        product.expiryDate = new Date(product.expiryDate);
      });
      setProducts(parsedProducts);
    }
  }, []);

  useEffect(() => {
    const productsToStore = products.map((product) => ({
      ...product,
      expiryDate: product.expiryDate.toISOString(),
    }));
    localStorage.setItem("products", JSON.stringify(productsToStore));
  }, [products]);

  const addProduct = (product) => {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);
    setProducts([...products, { ...product, expiryDate }]);
  };

  const handleUpdate = (index) => {
    alert(`Update configuration for ${menuItems[index].name}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="SEARCH"
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary ml-2">Submit</button>
        {/* <ProductForm addProduct={addProduct} /> */}
      </div>
      <table className="table table-zebra border w-full">
        <thead>
          <tr>
            <th>Item komposisi/ Menu</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Kelompok</th>
            <th>Life Time</th>
            <th>Config</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.uom}</td>
              <td>{item.kelompok}</td>
              <td className={getLifeTimeColor(item.lifeTime)}>
                {item.lifeTime}
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdate(index)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="btn-group mt-4 space-x-2">
        <button className="btn btn-outline" onClick={() => paginate(1)}>
          &lt;&lt; First
        </button>
        <button
          className="btn btn-outline"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        <button
          className="btn btn-outline"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= menuItems.length}
        >
          Next &gt;
        </button>
        <button
          className="btn btn-outline"
          onClick={() => paginate(Math.ceil(menuItems.length / itemsPerPage))}
          disabled={indexOfLastItem >= menuItems.length}
        >
          Last &gt;&gt;
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <Link className="btn btn-primary" to={"/"}>
          DISPLAY HOLDING TIME
        </Link>
        <Link className="btn btn-success" to={"/pdlc"}>
          PDLC
        </Link>
        <button className="btn btn-warning">RMLC</button>
      </div>
    </div>
  );
};

const getLifeTimeColor = (lifeTime) => {
  const minutes = parseInt(lifeTime.split(":")[0], 10);
  if (minutes < 10) return "text-red-500";
  if (minutes < 20) return "text-yellow-500";
  return "text-green-500";
};

export default HoldingTimeCur;
