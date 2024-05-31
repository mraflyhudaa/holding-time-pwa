import { useEffect, useState } from "react";
import { calculateRemainingTime } from "../utils/calculateRemainingTime";
import ProductForm from "./ProductForm";

interface Product {
  name: string;
  expiryDate: Date;
}

interface RemainingTime {
  minutes: number;
  seconds: number;
}

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  addProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  searchTerm,
  addProduct,
}) => {
  const [timers, setTimers] = useState<{ [key: string]: RemainingTime }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers: { [key: string]: RemainingTime } = {};
      products.forEach((product) => {
        const expiryDate = new Date(product.expiryDate);
        if (!isNaN(expiryDate.getTime())) {
          const remainingTime = calculateRemainingTime({ expiryDate });
          updatedTimers[product.name] = remainingTime;
        } else {
          updatedTimers[product.name] = { minutes: 0, seconds: 0 };
        }
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-screen mx-auto mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold my-3">Product List</h2>
        <ProductForm addProduct={addProduct} />
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>UOM</th>
              <th>Life Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const { minutes, seconds } = timers[product.name] || {
                minutes: 0,
                seconds: 0,
              };
              const expired = minutes === 0 && seconds === 0;
              const expiring = minutes < 5;
              const warning = minutes < 15 && minutes >= 5;

              let bgColor = "bg-green-500";
              if (expired) {
                bgColor = "bg-red-500";
              } else if (expiring) {
                bgColor = "bg-red-500";
              } else if (warning) {
                bgColor = "bg-yellow-500";
              }

              let expiryTime = `${minutes}:${seconds}`;
              if (expired) {
                expiryTime = "expired";
              }
              return (
                <tr key={index}>
                  <td>
                    <div className="font-bold">{product.name}</div>
                  </td>
                  <td>60</td>
                  <td>pcs</td>
                  <td>
                    <span className={`px-4 py-2 rounded-lg w-16 ${bgColor}`}>
                      {expiryTime}
                    </span>
                  </td>
                  <th>
                    <button className="btn btn-ghost btn-xs">update</button>
                  </th>
                </tr>
              );
            })}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>UOM</th>
              <th>Life Time</th>
              <th>Action</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className="space-y-2"></ul>
    </div>
  );
};

export default ProductList;
