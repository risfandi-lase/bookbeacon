import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar       from "../Components/NavBar";
import Register     from "../Components/Register";
import SearchBooks  from "../Components/SearchBooks";
import MyBooks      from "../Components/MyBooks";
import Login        from "../Components/Login";
import BookDetails  from "../Components/BookDetails";
import { Toaster }  from "react-hot-toast";
import { AuthProvider, useAuth } from "./AuthContext";

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserName("");
  };

  return (
    <div data-theme="cupcake" className="flex bg-base-200 min-h-screen">
      <Router>
        <NavBar userName={user?.user_name} />
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <MyBooks />
              ) : (
                <Login />
              )
            }
          />

          {/* Book Details route */}
          <Route
            path="/book/:id"
            element={
              isAuthenticated ? (
                <BookDetails />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/search-books"
            element={
              isAuthenticated ? (
                <SearchBooks />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/register"   element={<Register />} />
          <Route path="/login"      element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;