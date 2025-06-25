import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "../src/assets/img.png";
import { FaCirclePlus, FaCircleCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useAuth } from "../src/AuthContext";

function SearchBooks() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load favorite books from localStorage to show which books are already added
  useEffect(() => {
    const loadFavoriteBooks = () => {
      try {
        const userId = user?.userId || 'default';
        const storageKey = `favoriteBooks_${userId}`;
        const savedBooks = localStorage.getItem(storageKey);
        
        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks);
          setFavoriteBooks(parsedBooks);
        }
      } catch (error) {
        console.error('Error loading favorite books:', error);
      }
    };

    if (user) {
      loadFavoriteBooks();
    }
  }, [user]);

  // Check if a book is already in favorites
  const isBookInFavorites = (bookId) => {
    return favoriteBooks.some(book => book.id === bookId);
  };

  // Add book to favorites
  const handleAddBook = (book) => {
    if (isBookInFavorites(book.id)) {
      toast.error(`"${book.volumeInfo.title}" is already in your favorites`);
      return;
    }

    try {
      const userId = user?.userId || 'default';
      const storageKey = `favoriteBooks_${userId}`;
      
      // Add dateAdded timestamp to the book
      const bookWithDate = {
        ...book,
        dateAdded: new Date().toISOString()
      };
      
      const updatedFavorites = [...favoriteBooks, bookWithDate];
      
      // Update localStorage
      localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
      
      // Update local state
      setFavoriteBooks(updatedFavorites);
      
      toast.success(`"${book.volumeInfo.title}" added to your favorites`);
    } catch (error) {
      console.error('Error adding book to favorites:', error);
      toast.error('Failed to add book to favorites');
    }
  };

  /* ----------------------------- Google Books ----------------------------- */
  const fetchBook = async () => {
    // avoid empty queries
    if (!search.trim()) return;

    setHasSearched(true);
    setLoading(true);

    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        {
          params: {
            q: search,
            key: "AIzaSyDRsILYFZvZCReaxZSIzGM1yia5vgntOR8",
            maxResults: 20, // Get more results
          },
          withCredentials: false,
        }
      );

      // store results in state so we can render them
      setBooks(data.items || []);
      console.log(data.items);
    } catch (err) {
      console.error("Google Books error:", err);
      toast.error("Failed to search books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- RENDER ----------------------------- */
  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start">
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
            disabled={loading}
          />
        </label>
        <button 
          type="submit"
          className={`btn btn-neutral btn-outline w-24 font-lexend text-xs font-[500] mx-auto ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {hasSearched && !loading && (
        <div className="mt-8 mb-4">
          <p className="font-outfit text-sm text-gray-600">
            Search results for "<strong>{search}</strong>" - {books.length} books found
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center w-full min-h-96">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 font-outfit">Searching for books...</p>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 font-outfit w-full">
        {books.map((book) => {
          const isInFavorites = isBookInFavorites(book.id);
          
          return (
            <div key={book.id} className="border relative border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow  w-40">
              <img
  src={
    book.volumeInfo.imageLinks?.thumbnail ||
    book.volumeInfo.imageLinks?.smallThumbnail ||
    "/fallback-image.jpg"
  }
  alt={book.volumeInfo.title}
  className="h-60 mb-2 w-full hover:scale-103 transition"
  onError={(e) => {
    e.target.src = "/fallback-image.jpg";
  }}
/>
              <div className="flex flex-col gap-2 p-3">
                <div className="font-bold text-sm line-clamp-2" title={book.volumeInfo.title}>
                  {book.volumeInfo.title}
                </div>
                <p className="font-light text-xs text-gray-600 line-clamp-1" title={book.volumeInfo.authors?.join(', ')}>
                  {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                </p>
                
              </div>
              
              <div
                className={`absolute top-2 right-2 rounded-full p-1 text-2xl cursor-pointer transition-all shadow-sm ${
                  isInFavorites 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-110'
                }`}
                onClick={() => handleAddBook(book)}
                title={isInFavorites ? 'Already in favorites' : 'Add to favorites'}
              >
                {isInFavorites ? <FaCircleCheck /> : <FaCirclePlus />}
              </div>
            </div>
          );
        })}
      </div>

      {hasSearched && !loading && books.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full min-h-96 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h4 className="text-xl font-lexend mb-2">No books found</h4>
          <p className="font-outfit text-gray-600">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchBooks;
