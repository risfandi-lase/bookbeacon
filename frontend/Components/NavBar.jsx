import React from "react";
import Logo from "../src/assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../src/AuthContext";

function NavBar({ userName }) {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="">
      <ul className="menu w-72 min-h-full h-full bg-base-300 text-base-content font-lexend text-sm font-[300] leading-loose">
        <li className="mb-4">
          <div className="flex -space-x-3">
            <a className="text-2xl font-lexend font-[300] mt-5.5">
              BookBeacon{" "}
            </a>
            <img src={Logo} alt="" className="w-10" />
          </div>
        </li>
        
        {isAuthenticated ? (
          <>
            {user?.user_name && (
              <li className="mb-2">
                <div className="text-xs opacity-60">
                  Welcome, {user.user_name}
                </div>
              </li>
            )}
            <li>
              <Link to="/" className="active">
                My Books
              </Link>
            </li>
            <li>
              <Link to="/search-books">Search Books</Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="text-left hover:bg-base-300 w-full"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NavBar;
