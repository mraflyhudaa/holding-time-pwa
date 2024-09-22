import React, { useEffect, useState } from "react";
import { calculatePDLC } from "../services/pdlcService";
import Modal from "../component/Modal";

const CalculatePDLC = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [result, setResult] = useState("");
  const [shhb, setShhb] = useState("D04");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let interval;
    if (isLoading && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 3 + 1;
          return Math.min(prev + increment, 90);
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading, progress]);

  const handleCalculate = async () => {
    if (dateFrom && dateTo) {
      setIsLoading(true);
      setResult("");
      setProgress(0);
      try {
        const data = await calculatePDLC(shhb, dateFrom, dateTo, setProgress);
        console.log(data);
        // setResult(`The difference is ${data.diffInDays} days.`);
      } catch (error) {
        document.getElementById("modal-component").showModal();
        setResult("An error occurred while calculating. Please try again.");
      } finally {
        setIsLoading(false);
        setProgress(100);
      }
    } else {
      setResult("Please select both dates.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Modal isOpen={isModalOpen} title="Error!">
        <p className="py-4">{result}</p>
      </Modal>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title"></h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date From</span>
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
              <span className="label-text">Date To</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="form-control mt-6">
            <button
              className="btn btn-primary"
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
              <p className="text-center mt-2">
                Calculating... {Math.round(progress)}%
              </p>
            </div>
          )}
          {/* {result && !isLoading && (
            <div className="mt-4 text-center">
              <p>{result}</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CalculatePDLC;
