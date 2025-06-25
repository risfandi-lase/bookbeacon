import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Image from "../src/assets/img.png";
import { FaCirclePlus } from "react-icons/fa6";
import toast from "react-hot-toast";


function SearchBooks({ onAddBook, setUserName }) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]); // <-- NEW
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    refreshToken();
    fetchBook();
  }, []);

  /* ----------------------------- Google Books ----------------------------- */
  const fetchBook = async () => {
    // avoid empty queries
    if (!search.trim()) return;

    setHasSearched(true);

    try {
      // use ONE style: async/await
      const { data } = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        {
          params: {
            q: search,
            key: "AIzaSyDRsILYFZvZCReaxZSIzGM1yia5vgntOR8",
          },
          withCredentials: false,
        }
      );

      // store results in state so we can render them
      setBooks(data.items || []);
      console.log(data.items);
    } catch (err) {
      console.error("Google Books error:", err);
    }
  };

  /* ---------------------------- JWT refresh ---------------------------- */
  const refreshToken = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/token");
      setToken(data.accessToken);
      const decoded = jwtDecode(data.accessToken);
      setName(decoded.user_name);
      setUserName(decoded.user_name);
      setExpire(decoded.exp);
    } catch (err) {
      if (err.response) navigate("/login");
    }
  };

  /* ----------------------------- RENDER ----------------------------- */
  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start ">
      <p className="text-3xl font-[300] mb-7 font-lexend">Search Books</p>

      <form
        className="flex gap-2"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          fetchBook();
        }}
      >
        <label className="input">
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            className="font-lexend"
            type="search"
            placeholder="Search a book…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </label>
        <button className="btn btn-neutral btn-outline opacity-30 w-24 font-lexend text-xs font-[500] mx-auto">
          Search
        </button>
      </form>

      {hasSearched && (
        <p className="mb-4 mt-8 font-outfit">
          Search results for "<strong>{search}</strong>"
        </p>
      )}

      {/* Results */}
      <div className="grid grid-cols-5 gap-8 font-outfit ">
        {books.map((book) => (
          <ul key={book.id} className="border relative border-gray-300 w-40">
            <img
              src={
                book.volumeInfo.imageLinks?.thumbnail || "/fallback-image.jpg"
              }
              alt={book.volumeInfo.title}
              className="h-60 mb-2 w-full hover:scale-103 transition"
            />
            <div className="flex flex-col gap-2  p-2 ">
              <li className="font-bold whitespace-normal break-words ">
                {book.volumeInfo.title}
              </li>
              <p className="mb-18 font-light text-sm">
                {book.volumeInfo.authors?.join(", ")}
              </p>
            </div>
            <div
              className="absolute bottom-2 right-2 text-gray-600 text-2xl cursor-pointer hover:scale-110 transition"
              onClick={() => {
                onAddBook(book);
              toast.success(`"${book.volumeInfo.title}" added to my books`); 
              }}
            >
              <FaCirclePlus />
            </div>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default SearchBooks;
