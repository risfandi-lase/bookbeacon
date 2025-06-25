import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar       from "../Components/NavBar";
import Register     from "../Components/Register";
import SearchBooks  from "../Components/SearchBooks";
import MyBooks      from "../Components/MyBooks";
import BookStatus   from "../Components/BookStatus";
import Login        from "../Components/Login";
import BookDetails  from "../Components/BookDetails";
import { Toaster }  from "react-hot-toast";

function App() {
  const [myBooks, setMyBooks] = useState([]);
  const [userName, setUserName] = useState("");

  const handleAddBook = (book) => {
    if (!myBooks.some((b) => b.id === book.id)) {
      setMyBooks((prev) => [...prev, book]);
    }
  };

  return (
    <div data-theme="light" className="flex min-h-screen">
      <Router>
        <NavBar userName={userName} />
        <Toaster />

        <Routes>
          {/* Home / shelf */}
          <Route
            path="/"
            element={
              <MyBooks
                books={myBooks}
                setBooks={setMyBooks}   /* ← so we can delete */
              />
            }
          />

          {/* New route ↓↓↓ */}
          <Route
            path="/book/:id"
            element={<BookDetails books={myBooks} />}
          />

          <Route
            path="/search-books"
            element={
              <SearchBooks
                onAddBook={handleAddBook}
                setUserName={setUserName}
              />
            }
          />
          <Route path="/book-status" element={<BookStatus />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/login"      element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;