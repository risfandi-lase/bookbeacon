import React from "react";

export default function MyBooks({ books }) {
  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start">
      <h3 className="text-3xl font-[300] font-lexend">My Books</h3>
      {books.map(book => (
        <div key={book.id}>
          <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title}/>
          <div>{book.volumeInfo.title}</div>
        </div>
      ))}
    </div>
  );
}

