import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://bookbeacon.onrender.com/register", {
        user_name: name,
        password: password,
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start ">
      <h1 className="text-3xl font-[300] font-lexend">Register</h1>
      <p>{msg}</p>
      <form action="" onSubmit={Register} className="flex-col flex">
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
            placeholder="Username (without space)"
            pattern="[A-Za-z][A-Za-z0-9\-]*"
            maxLength="30"
          />
        </label>

        <label className="input validator font-lexend text-xs w-100 relative flex items-center">
          <svg
            className="h-[1em] opacity-50 mr-2"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            className="flex-1 pr-8"
          />

          {/* Eye icon */}
          <span
            className="absolute right-3 cursor-pointer"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              // Eye open
              <svg
                width={20}
                height={20}
                opacity={0.5}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx={12} cy={12} r={3} />
              </svg>
            ) : (
              // Eye closed
              <svg
                width={20}
                height={20}
                opacity={0.5}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.94 21.94 0 015.06-7.94M22.54 6.42A21.94 21.94 0 0123 12s-4 7-11 7c-2.01-.01-3.92-.38-5.74-1M3.51 3.51L21.49 21.49" />
                <line x1={1} y1={1} x2={23} y2={23} />
              </svg>
            )}
          </span>
        </label>
        <button className="btn btn-neutral btn-outline opacity-30 w-24 mt-6 font-lexend text-xs font-[500] mx-auto">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
