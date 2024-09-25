import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-b from-red-600 to-red-800">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Hokben
          </h1>
          <p className="text-xl text-white">
            Enjoy authentic Japanese cuisine at your fingertips.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="flex justify-center mb-4">
              <img src="/logo.svg" alt="Hokben Logo" className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4 text-red-800">
              Login
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-red-800">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered bg-red-50 focus:border-red-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-red-800">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered bg-red-50 focus:border-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-red-600 hover:bg-red-700 text-white border-none">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
