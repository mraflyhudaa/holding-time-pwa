import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Product {
  name: string;
  expiryDate: Date;
}

interface ProductFormProps {
  addProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ addProduct }) => {
  const [name, setName] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addProduct({ name, expiryDate });
    setName("");
    setExpiryDate(new Date());
    closeModal();
  };

  return (
    <>
      <button className="btn btn-sm btn-primary" onClick={openModal}>
        Add Item
      </button>
      <dialog id="my_modal_3" ref={modalRef} className="modal">
        <div className="modal-box">
          <div className="">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Add Product</h3>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Expiry Date:
                </label>
                <DatePicker
                  selected={expiryDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setExpiryDate(date);
                    }
                  }}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Add Product
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ProductForm;
