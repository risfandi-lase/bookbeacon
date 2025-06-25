import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Register from "../Components/Register";
import SearchBooks from "../Components/SearchBooks";
import MyBooks from "../Components/MyBooks";
import BookStatus from "../Components/BookStatus";
import Login from "../Components/Login";
import BookDetails from "../Components/BookDetails";
import ProtectedRoute from "../Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  const [myBooks, setMyBooks] = useState([]);
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
      setUserName(user);
    }
  }, []);

  const handleAddBook = (book) => {
    if (!myBooks.some((b) => b.id === book.id)) {
      setMyBooks((prev) => [...prev, book]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserName("");
  };

  return (
    <div data-theme="light" className="flex min-h-screen">
      <Router>
        <NavBar
          userName={userName}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MyBooks books={myBooks} setBooks={setMyBooks} />
              </ProtectedRoute>
            }
          />
          <Route path="/book/:id" element={<BookDetails books={myBooks} />} />
          <Route
            path="/search-books"
            element={
              <ProtectedRoute>
                <SearchBooks
                  onAddBook={handleAddBook}
                  setUserName={setUserName}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-status"
            element={
              <ProtectedRoute>
                <BookStatus />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setUserName={setUserName}/>}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;