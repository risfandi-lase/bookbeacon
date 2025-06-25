import React from "react";
import Logo from "../src/assets/logo.png";
import { Link } from "react-router-dom";

function NavBar({ userName, isAuthenticated, handleLogout }) {
  return (
    <div className="">
      <ul className="menu w-72 min-h-full h-full bg-base-250 text-base-content font-lexend text-sm font-[300] leading-loose">
        <li className="">
          <div className="flex -space-x-3">
            <a className="text-2xl font-lexend font-[300] mt-5.5 ">
              BookBeacon{" "}
            </a>
            <img src={Logo} alt="" className="w-10 " />
          </div>
        </li>
        {isAuthenticated ? (
          <>
            <div>
              <p className="text-info ml-3 mb-6">Welcome, {userName}</p>
            </div>
            <li>
              <Link to="/" className="active">
                My Books
              </Link>
            </li>
            <li>
              <Link to="/search-books">Search Books</Link>
            </li>
            <li>
              <Link to="/book-status">Book Status</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NavBar;
