import React from "react";
import Logo from "../src/assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../src/AuthContext";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="flex">
      {/* ============  MOBILE (hamburger + dropdown)  ============ */}
      <div className="dropdown dropdown-start lg:hidden w-20">
        <div tabIndex={0} role="button" className="btn m-1">
          <label className="btn btn-circle swap swap-rotate">
            <input type="checkbox" />

            {/* hamburger icon */}
            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64 128h384v42.666H64zM64 234.667h384v42.666H64zM64 341.333h384v42.667H64z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path
                d="M378.304 115.456L268.288 225.472 158.272 115.456l-42.816 42.816L225.472
           268.288 115.456 378.304 158.272 421.12 268.288 311.104 378.304 421.12
           l42.816-42.816L311.104 268.288 421.12 158.272z"
              />
            </svg>
          </label>
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
        >
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/">My Books</Link>
              </li>
              <li>
                <Link to="/search-books">Search Books</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
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

      {/* ============  DESKTOP (permanent side menu)  ============ */}
      <ul
        className="menu w-72 min-h-full h-full bg-base-300 text-base-content
                     font-lexend text-sm font-[300] leading-loose
                     hidden lg:block"
      >
        <li className="mb-4">
          <div className="flex -space-x-3">
            <span className="text-2xl font-lexend font-[300] mt-5.5">
              BookBeacon
            </span>
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
                onClick={logout}
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
