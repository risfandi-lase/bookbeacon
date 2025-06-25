import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import Register from '../Components/Register'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBooks from '../Components/SearchBooks'
import  MyBooks from '../Components/MyBooks'
import BookStatus from '../Components/BookStatus'
import Login from '../Components/Login';

function App() {
  const [myBooks, setMyBooks] = useState([])
  const [userName, setUserName] = useState("")

  const handleAddBook = (book) =>{
    if(!myBooks.some(b => b.id === book.id)){
      setMyBooks([...myBooks, book])
    }
  }


  return (
    <div data-theme="light" className='flex min-h-screen '>
      <Router>

          <NavBar userName={userName}/>
        <Routes>


                  <Route path="/" element= {<MyBooks books={myBooks}/>} />
                  <Route path="/search-books" element= {<SearchBooks onAddBook = {handleAddBook} setUserName={setUserName}/>} />
                  <Route path="/book-status" element= {<BookStatus/>} />
                  <Route path="/register" element= {<Register/>} />
                  <Route path="/login" element= {<Login/>} />



        </Routes>  
          
      </Router>
    </div>
  )
}

export default App