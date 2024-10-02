import React, { useEffect, useState } from "react";
import { calculatePDLC } from "../services/pdlcService";
import Modal from "../component/Modal";
import { useAuth } from "../context/AuthContext";

const CalculatePDLC = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [hourFrom, setHourFrom] = useState("");
  const [hourTo, setHourTo] = useState("");
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    let interval;
    if (isLoading && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 6 + 1;
          return Math.min(prev + increment, 90);
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading, progress]);

  const handleCalculate = async () => {
    if (dateFrom && dateTo && hourFrom && hourTo) {
      setIsLoading(true);
      setResult("");
      setProgress(0);
      try {
        const data = await calculatePDLC(
          user.hhb,
          dateFrom,
          dateTo,
          hourFrom,
          hourTo,
          setProgress
        );
        console.log(data);
        setResult(
          `Calculate PDLC from ${dateFrom} ${hourFrom}:00 to ${dateTo} ${hourTo}:00 success`
        );
        setTitle("Success");
        document.getElementById("modal-component").showModal();
      } catch (error) {
        const res = error.response.data;
        setResult(res.messages.error);
        setTitle("Error");
        document.getElementById("modal-component").showModal();
      } finally {
        setIsLoading(false);
        setProgress(100);
      }
    } else {
      setResult("Please fill in all fields.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Modal isOpen={isModalOpen} title={title}>
        <p className="py-4">{result}</p>
      </Modal>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">Calculate PDLC</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Date From</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Date To</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Hour From (0-23)</span>
              </label>
              <input
                type="number"
                min="0"
                max="23"
                className="input input-bordered"
                value={hourFrom}
                onChange={(e) => setHourFrom(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Hour To (0-23)</span>
              </label>
              <input
                type="number"
                min="0"
                max="23"
                className="input input-bordered"
                value={hourTo}
                onChange={(e) => setHourTo(e.target.value)}
              />
            </div>
          </div>
          <div className="form-control mt-6">
            <button
              className="btn btn-primary text-lg"
              onClick={handleCalculate}
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate"}
            </button>
          </div>
          {isLoading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center mt-2 text-lg">
                Calculating... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatePDLC;
