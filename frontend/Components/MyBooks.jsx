import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../src/AuthContext";

export default function MyBooks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // What do we want to sort by? default = 'title'
  const [orderBy, setOrderBy] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all"); // "all", "status-grouped", or specific status
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Load books from localStorage on component mount
  useEffect(() => {
    const loadFavoriteBooks = () => {
      try {
        const userId = user?.userId || "default";
        const storageKey = `favoriteBooks_${userId}`;
        const savedBooks = localStorage.getItem(storageKey);

        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks);
          setBooks(parsedBooks);
        }
      } catch (error) {
        console.error("Error loading favorite books:", error);
        toast.error("Failed to load your favorite books");
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteBooks();
  }, [user]);

  // Save books to localStorage whenever books array changes
  useEffect(() => {
    if (!loading && user) {
      try {
        const userId = user.userId || "default";
        const storageKey = `favoriteBooks_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(books));
      } catch (error) {
        console.error("Error saving favorite books:", error);
      }
    }
  }, [books, loading, user]);

  // Reading status options for filtering
  const statusOptions = [
    { value: "all", label: "All Books", emoji: "📚" },
    { value: "want-to-read", label: "Want to Read", emoji: "📚" },
    { value: "currently-reading", label: "Currently Reading", emoji: "📖" },
    { value: "completed", label: "Completed", emoji: "✅" },
    { value: "on-hold", label: "On Hold", emoji: "⏸️" },
    { value: "dropped", label: "Dropped", emoji: "❌" },
    { value: "unset", label: "No Status Set", emoji: "⚪" },
  ];

  // Filter books by status
  const filteredBooks = useMemo(() => {
    if (selectedStatus === "all") return books;

    if (selectedStatus === "unset") {
      return books.filter((book) => !book.readingStatus);
    }

    return books.filter((book) => book.readingStatus === selectedStatus);
  }, [books, selectedStatus]);

  // Helper that returns a *new* sorted array
  const sortedBooks = useMemo(() => {
    let booksToSort = viewMode === "status-grouped" ? books : filteredBooks;

    return [...booksToSort].sort((a, b) => {
      if (orderBy === "dateAdded") {
        return new Date(b.dateAdded) - new Date(a.dateAdded); // newest first
      } else if (orderBy === "title") {
        return (a.volumeInfo?.title || "").localeCompare(
          b.volumeInfo?.title || ""
        );
      } else if (orderBy === "author") {
        const aAuthor = a.volumeInfo?.authors?.[0] || "";
        const bAuthor = b.volumeInfo?.authors?.[0] || "";
        return aAuthor.localeCompare(bAuthor);
      } else if (orderBy === "rating") {
        return (b.rating || 0) - (a.rating || 0); // highest first
      } else if (orderBy === "lastUpdated") {
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0); // newest first
      }
      return 0;
    });
  }, [orderBy, books, filteredBooks, viewMode]);

  // Group books by status for grouped view
  const groupedBooks = useMemo(() => {
    const grouped = {};
    statusOptions.forEach((status) => {
      if (status.value === "all") return;

      if (status.value === "unset") {
        grouped[status.value] = books.filter((book) => !book.readingStatus);
      } else {
        grouped[status.value] = books.filter(
          (book) => book.readingStatus === status.value
        );
      }
    });
    return grouped;
  }, [books]);

  const handleDelete = (bookId) => {
    const bookToDelete = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));

    if (bookToDelete) {
      toast.success(
        `"${
          bookToDelete.volumeInfo?.title || "Book"
        }" has been removed from your favorites`
      );
    }
  };

  const handleBookClick = (book) => {
    // Navigate to book details with the book data
    navigate(`/book/${book.id}`, { state: { book } });
  };

  // Get statistics
  const getStatusStats = () => {
    const stats = {};
    statusOptions.forEach((status) => {
      if (status.value === "all") return;

      if (status.value === "unset") {
        stats[status.value] = books.filter(
          (book) => !book.readingStatus
        ).length;
      } else {
        stats[status.value] = books.filter(
          (book) => book.readingStatus === status.value
        ).length;
      }
    });
    return stats;
  };

  const stats = getStatusStats();

  // Render book card component
  const BookCard = ({ book }) => (
    <div
      key={book.id}
      className="border w-40 flex flex-col border-gray-300 relative  overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Status Badge */}
      {book.readingStatus && (
        <div className="absolute top-2 left-2 z-10">
          <span className="badge badge-sm bg-blue-100 text-blue-800 border-blue-200 text-xs">
            {statusOptions.find((opt) => opt.value === book.readingStatus)
              ?.emoji || "📚"}
          </span>
        </div>
      )}

      {/* Rating Badge */}
      {book.rating && book.rating > 0 && (
        <div
          className="absolute top-2 left-2 z-10"
          style={{ marginTop: book.readingStatus ? "24px" : "0" }}
        >
          <span className="badge badge-sm bg-orange-100 text-orange-800 border-orange-200 text-xs">
            ⭐ {book.rating}
          </span>
        </div>
      )}

      <img
        src={
          book.volumeInfo?.imageLinks?.thumbnail ||
          book.volumeInfo?.imageLinks?.smallThumbnail ||
          "/fallback-image.jpg"
        }
        alt={book.volumeInfo?.title || "Book cover"}
        className="h-60 w-full object-cover cursor-pointer  transition-transform"
        onClick={() => handleBookClick(book)}
        onError={(e) => {
          e.target.src = "/fallback-image.jpg";
        }}
      />
      <div className="p-3">
        <div
          className="font-bold text-gray-700  text-sm line-clamp-2 cursor-pointer hover:scale-110 transition "
          onClick={() => handleBookClick(book)}
          title={book.volumeInfo?.title}
        >
          {book.volumeInfo?.title || "Unknown Title"}
        </div>
        <p
          className="font-light text-xs  cursor-default text-gray-600 mb-4 mt-1 line-clamp-1"
          title={book.volumeInfo?.authors?.join(", ")}
        >
          {book.volumeInfo?.authors?.join(", ") || "Unknown Author"}
        </p>
      </div>

      <div
        onClick={() => handleDelete(book.id)}
        className="mt-auto ml-auto  rounded-full mb-2 p-1 text-red-400 cursor-pointer   transition-all shadow-sm"
        title="Remove from favorites"
      >
        <RiDeleteBin6Line className="text-lg" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-center justify-center min-h-96">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4 font-outfit">Loading your books...</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start">
      <h3 className="text-3xl font-[300] mb-6 font-lexend">My Books</h3>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-96 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h4 className="text-xl font-lexend mb-2">No books yet!</h4>
          <p className="font-outfit text-gray-600 mb-4">
            Start building your personal library by searching for books and
            adding them to your favorites.
          </p>
          <button
            className="btn btn-primary font-outfit"
            onClick={() => navigate("/search-books")}
          >
            Search Books
          </button>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2  md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 w-full">
            {statusOptions.map((status) => {
              if (status.value === "all") return null;
              const count = stats[status.value] || 0;
              return (
                <div
                  key={status.value}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedStatus === status.value
                      ? "bg-blue-100 border-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedStatus(status.value);
                    setViewMode("filter");
                  }}
                >
                  <div className="text-2xl mb-1">{status.emoji}</div>
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-gray-600">{status.label}</div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                className={`btn btn-sm text-gray-600 ${
                  viewMode === "all" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => {
                  setViewMode("all");
                  setSelectedStatus("all");
                }}
              >
                All Books
              </button>
              <button
                className={`btn btn-sm text-gray-600 ${
                  selectedStatus !== "all" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setViewMode("filter")}
              >
                Filter View
              </button>
              <button
                className={`btn btn-sm text-gray-600 ${
                  viewMode === "status-grouped" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setViewMode("status-grouped")}
              >
                Group by Status
              </button>
            </div>

            {/* Status Filter - only show when in filter mode */}
            {viewMode === "filter" && (
              <select
                className="select select-bordered select-sm font-outfit min-w-48"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label} (
                    {stats[option.value] ||
                      (option.value === "all" ? books.length : 0)}
                    )
                  </option>
                ))}
              </select>
            )}

            {/* Sort controls */}
            <div className="flex items-center gap-2">
              <span className="font-outfit text-sm">Sort by:</span>
              <select
                className="select select-bordered select-sm font-outfit"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="dateAdded">Recently Added</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="rating">Rating</option>
                <option value="lastUpdated">Last Updated</option>
              </select>
            </div>
          </div>

          {/* Books count */}
          <p className="font-outfit text-sm text-gray-600 mb-4">
            {viewMode === "status-grouped"
              ? `${books.length} book${
                  books.length !== 1 ? "s" : ""
                } in your library`
              : `${filteredBooks.length} book${
                  filteredBooks.length !== 1 ? "s" : ""
                } ${
                  selectedStatus !== "all"
                    ? `in ${
                        statusOptions.find(
                          (opt) => opt.value === selectedStatus
                        )?.label
                      }`
                    : "in your library"
                }`}
          </p>

          {/* Books Display */}
          {viewMode === "status-grouped" ? (
            /* Grouped View */
            <div className="w-full space-y-8">
              {statusOptions.map((status) => {
                if (
                  status.value === "all" ||
                  !groupedBooks[status.value]?.length
                )
                  return null;

                return (
                  <div key={status.value}>
                    <h4 className="text-xl font-semibold mb-4 font-lexend flex items-center gap-2">
                      <span className="text-2xl">{status.emoji}</span>
                      {status.label} ({groupedBooks[status.value].length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 font-outfit">
                      {groupedBooks[status.value].map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Regular Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-7 font-outfit">
              {sortedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Empty State for Filtered View */}
          {viewMode === "filter" &&
            filteredBooks.length === 0 &&
            selectedStatus !== "all" && (
              <div className="flex flex-col items-center justify-center w-full min-h-96 text-center">
                <div className="text-6xl mb-4">
                  {statusOptions.find((opt) => opt.value === selectedStatus)
                    ?.emoji || "📚"}
                </div>
                <h4 className="text-xl font-lexend mb-2">
                  No books in "
                  {
                    statusOptions.find((opt) => opt.value === selectedStatus)
                      ?.label
                  }
                  "
                </h4>
                <p className="font-outfit text-gray-600 mb-4">
                  Books you mark with this status will appear here.
                </p>
                <button
                  className="btn btn-primary font-outfit"
                  onClick={() => setSelectedStatus("all")}
                >
                  View All Books
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
}
