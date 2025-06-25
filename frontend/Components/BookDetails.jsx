import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../src/AuthContext";
import toast from "react-hot-toast";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reading status state
  const [readingStatus, setReadingStatus] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const findBook = () => {
      // First try to get book from navigation state
      const bookFromState = location.state?.book;
      
      if (bookFromState) {
        setBook(bookFromState);
        // Load existing reading data if available
        loadReadingData(bookFromState);
        setLoading(false);
        return;
      }

      // If not in state, try to find it in localStorage
      try {
        const userId = user?.userId || 'default';
        const storageKey = `favoriteBooks_${userId}`;
        const savedBooks = localStorage.getItem(storageKey);
        
        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks);
          const foundBook = parsedBooks.find((b) => b.id === id);
          
          if (foundBook) {
            setBook(foundBook);
            loadReadingData(foundBook);
          }
        }
      } catch (error) {
        console.error('Error loading book details:', error);
      } finally {
        setLoading(false);
      }
    };

    findBook();
  }, [id, location.state, user]);

  // Load reading data from the book object
  const loadReadingData = (bookData) => {
    setReadingStatus(bookData.readingStatus || "");
    setRating(bookData.rating || 0);
    setComments(bookData.comments || "");
  };

  // Save reading data to localStorage
  const saveReadingData = async () => {
    if (!book || !user) return;

    setIsSaving(true);
    try {
      const userId = user.userId || 'default';
      const storageKey = `favoriteBooks_${userId}`;
      const savedBooks = localStorage.getItem(storageKey);
      
      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks);
        const bookIndex = parsedBooks.findIndex((b) => b.id === book.id);
        
        if (bookIndex !== -1) {
          // Update existing book with reading data
          parsedBooks[bookIndex] = {
            ...parsedBooks[bookIndex],
            readingStatus,
            rating,
            comments,
            lastUpdated: new Date().toISOString()
          };
          
          localStorage.setItem(storageKey, JSON.stringify(parsedBooks));
          
          // Update local book state
          setBook(parsedBooks[bookIndex]);
          
          toast.success('Reading status saved successfully!');
        } else {
          // Book not found in favorites
          toast.error('Book not found in your favorites');
        }
      }
    } catch (error) {
      console.error('Error saving reading data:', error);
      toast.error('Failed to save reading status');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-lexend mb-2">Book not found</h3>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to My Books
          </button>
        </div>
      </div>
    );
  }

  // Extract book information with proper handling of Google Books API structure
  const title = book.volumeInfo?.title || book.title || 'Unknown Title';
  const authors = book.volumeInfo?.authors || (book.author ? [book.author] : ['Unknown Author']);
  const description = book.volumeInfo?.description || 'No description available.';
  const publishedDate = book.volumeInfo?.publishedDate;
  const pageCount = book.volumeInfo?.pageCount;
  const categories = book.volumeInfo?.categories;
  const imageUrl = book.volumeInfo?.imageLinks?.thumbnail || 
                   book.volumeInfo?.imageLinks?.smallThumbnail || 
                   book.image || 
                   "/fallback-image.jpg";

  // Reading status options
  const statusOptions = [
    { value: "", label: "Select Status", disabled: true },
    { value: "want-to-read", label: "📚 Want to Read" },
    { value: "currently-reading", label: "📖 Currently Reading" },
    { value: "completed", label: "✅ Completed" },
    { value: "on-hold", label: "⏸️ On Hold" },
    { value: "dropped", label: "❌ Dropped" }
  ];

  return (
    /* add relative -> allows absolute children */
    <div className="relative w-full min-h-screen bg-base-200 p-8">
      {/* ─── Back button in the top-left ─── */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm absolute top-4 left-4 z-10"
      >
        ⟵ Back
      </button>

      {/* book content */}
      <div className="max-w-6xl mx-auto pt-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-64 h-96 object-cover shadow-lg rounded-lg"
              onError={(e) => {
                e.target.src = "/fallback-image.jpg";
              }}
            />
          </div>

          {/* Book Information */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-lexend mb-2">{title}</h1>
              <p className="text-xl text-gray-600">by {authors.join(', ')}</p>
            </div>

            {/* Book metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {publishedDate && (
                <div>
                  <span className="font-semibold">Published:</span> {new Date(publishedDate).getFullYear()}
                </div>
              )}
              {pageCount && (
                <div>
                  <span className="font-semibold">Pages:</span> {pageCount}
                </div>
              )}
              {categories && categories.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold">Categories:</span> {categories.join(', ')}
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div 
                  className="text-gray-700 text-sm leading-relaxed max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}

            {/* Reading Status and Rating Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Your Reading Progress</h3>
              
              <div className="space-y-6">
                {/* Current Status Display */}
                {readingStatus && (
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-800">Current Status:</span>
                      <span className="ml-2 text-sm text-blue-700">
                        {statusOptions.find(opt => opt.value === readingStatus)?.label || readingStatus}
                      </span>
                    </div>
                  </div>
                )}

                {/* Status Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Reading Status</label>
                  <select 
                    className="select select-bordered w-full max-w-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={readingStatus}
                    onChange={(e) => setReadingStatus(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value} 
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Your Rating {rating > 0 && <span className="text-orange-500">({rating}/5 stars)</span>}
                  </label>
                  <div className="rating rating-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name="rating"
                        className="mask mask-star-2 bg-orange-400 cursor-pointer hover:bg-orange-500 transition-colors"
                        checked={rating === star}
                        onChange={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                  {rating > 0 && (
                    <button
                      className="text-xs text-gray-500 hover:text-gray-700 mt-1 underline"
                      onClick={() => handleRatingChange(0)}
                    >
                      Clear rating
                    </button>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Notes & Comments</label>
                  <textarea 
                    className="textarea textarea-bordered w-full h-24 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none" 
                    placeholder="Share your thoughts about this book..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {comments.length}/500 characters
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-2">
                  <button 
                    className="btn btn-primary flex-1 max-w-xs"
                    onClick={saveReadingData}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        💾 Save Changes
                      </>
                    )}
                  </button>
                  
                  {/* Reset Button */}
                  <button 
                    className="btn btn-ghost"
                    onClick={() => {
                      setReadingStatus("");
                      setRating(0);
                      setComments("");
                      toast.success('Form reset successfully');
                    }}
                    disabled={isSaving}
                  >
                    🔄 Reset
                  </button>
                </div>

                {/* Last Updated */}
                {book.lastUpdated && (
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Last updated: {new Date(book.lastUpdated).toLocaleDateString()} at {new Date(book.lastUpdated).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
