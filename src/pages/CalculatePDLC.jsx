import React, { useEffect, useState } from "react";
import { calculatePDLC } from "../services/calculatePDLC";

const CalculatePDLC = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate progress bar loading
  useEffect(() => {
    let interval;
    if (isLoading && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90)); // Progress up to 90%
      }, 500); // Increment every 500ms
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
        const data = await calculatePDLC(dateFrom, dateTo, setProgress);
        console.log(data);
        // setResult(`The difference is ${data.diffInDays} days.`);
      } catch (error) {
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
              <progress
                className="progress progress-primary w-full transition-all duration-700 ease-in-out"
                value={progress}
                max="100"
              ></progress>
              <p className="text-center mt-2">Calculating... {progress}%</p>
            </div>
          )}
          {result && !isLoading && (
            <div className="mt-4 text-center">
              <p>{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatePDLC;
