import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/AuthContext";

function Login({ setIsAuthenticated, setUserName }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const Auth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const result = await login(name, password);

      if (result.success) {
        navigate("/");
      } else {
        setMsg(result.message);
      }
    } catch (error) {
      setMsg("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start">
      <h1 className="text-3xl font-[300] font-lexend">Login</h1>

      <div className="font-lexend text-sm text-gray-400 mt-6 font-light">
        <p>Username: qwer</p>
        <p>Password: 123</p>
        <p>or Register instead </p>
      </div>

      <form onSubmit={Auth} action="" className="flex-col flex">
        {msg && <p className="text-error text-sm mt-2">{msg}</p>}
        <label className="input validator w-100 font-lexend text-xs mt-6 mb-4">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </g>
          </svg>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Username"
            pattern="[A-Za-z][A-Za-z0-9\-]*"
            maxLength="30"
            disabled={loading}
          />
        </label>

        <label className="input validator font-lexend text-xs w-100">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          className={`btn btn-neutral btn-outline w-24 mt-6 font-lexend text-xs font-[500] mx-auto ${
            loading ? "loading" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
