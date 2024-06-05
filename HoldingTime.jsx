import React, { useEffect, useState } from "react";
import ProductList from "../component/ProductList";

interface Product {
  name: string;
  expiryDate: Date;
}

const HoldingTime: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      const parsedProducts: Product[] = JSON.parse(storedProducts);
      parsedProducts.forEach(
        (product: Product) =>
          (product.expiryDate = new Date(product.expiryDate))
      );
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

  const addProduct = (product: Product) => {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);
    setProducts([...products, { ...product, expiryDate }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-sm mx-auto mt-4">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <ProductList
        products={products}
        searchTerm={searchTerm}
        addProduct={addProduct}
      />
    </div>
  );
};

export default HoldingTime;
