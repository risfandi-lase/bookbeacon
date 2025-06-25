import React from "react";
import it from "../src/assets/it.png";
import viving from "../src/assets/viving.png";
import celebrate from "../src/assets/celebrate.png";
import feel from "../src/assets/feel.png";
import amillion from "../src/assets/amillion.png";
import dontcall from "../src/assets/dontcall.png";
import littlea from "../src/assets/little.png";
import thesecret from "../src/assets/thesecret.png";
import illbe from "../src/assets/illbe.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const books = [
  { id: 1, image: it, title: "It", author: "Stephen King" },
  { id: 2, image: viving, title: "Viving", author: "Amelia" },
  {
    id: 3,
    image: celebrate,
    title: "Celebrate Forest",
    author: "Angel Dimaria",
  },
  { id: 4, image: feel, title: "Feel The Nature", author: "Jack A Hugo" },
  {
    id: 5,
    image: amillion,
    title: "A Million To One",
    author: "Tony Faggioli",
  },
  { id: 6, image: littlea, title: "Little Gods", author: "Meng Jin" },
  {
    id: 7,
    image: dontcall,
    title: "Don't Call A Wolf",
    author: "Aleksandra Ross",
  },
  {
    id: 8,
    image: thesecret,
    title: "The Secret Of Life",
    author: "Lottie Reinfeld",
  },
  { id: 9, image: illbe, title: "I'll Be Right Here", author: "Amy Bloom" },
];

export default function MyBooks() {
   const navigate = useNavigate();
  // what do we want to sort by?  default = 'title'
  const [orderBy, setOrderBy] = useState("title");
  const [books, setBooks] = useState([
    { id: 1, image: it, title: "It", author: "Stephen King" },
    { id: 2, image: viving, title: "Viving", author: "Amelia" },
    {
      id: 3,
      image: celebrate,
      title: "Celebrate Forest",
      author: "Angel Dimaria",
    },
    { id: 4, image: feel, title: "Feel The Nature", author: "Jack A Hugo" },
    {
      id: 5,
      image: amillion,
      title: "A Million To One",
      author: "Tony Faggioli",
    },
    { id: 6, image: littlea, title: "Little Gods", author: "Meng Jin" },
    {
      id: 7,
      image: dontcall,
      title: "Don't Call A Wolf",
      author: "Aleksandra Ross",
    },
    {
      id: 8,
      image: thesecret,
      title: "The Secret Of Life",
      author: "Lottie Reinfeld",
    },
    { id: 9, image: illbe, title: "I'll Be Right Here", author: "Amy Bloom" },
  ]);

  // helper that returns a *new* sorted array
  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      if (orderBy === "id") {
        return a.id - b.id; // numeric compare
      } else {
        return a[orderBy].localeCompare(b[orderBy]); // string compare
      }
    });
  }, [orderBy, books]);

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    const deleted = books.find((b) => b.id === id);
    toast.success(`"${deleted.title}" has been deleted`);
  };

  return (
    
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start">
      <h3 className="text-3xl font-[300] mb-6 font-lexend">My Books</h3>

      {/* simple select box to choose the sort key */}
      <p className="font-outfit ml-1 text-sm">Sort by:</p>
      <select
        defaultValue="Sort by"
        className="select mb-10 font-outfit w-25"
        value={orderBy}
        onChange={(e) => setOrderBy(e.target.value)}
      >
        <option value="id">Added</option>
        <option value="title">Title</option>
      </select>


      <div className="grid grid-cols-5 gap-8 font-outfit">
        {sortedBooks.map((book) => (
          <div key={book.id} className="border border-gray-300 relative">
            <img
              src={book.image}
              className="h-60 w-40 cursor-pointer hover:scale-104 transition "
              onClick={() =>
                navigate(`/book/${book.id}`, { state: { book } })
              }
            />
            <div className="font-bold whitespace-normal break-words p-2">
              {book.title}
            </div>
            <p className="mb-18 font-light text-sm p-2">{book.author}</p>

            <div
              onClick={() => {
                handleDelete(book.id);
              }}
              className="absolute bottom-2 right-2 text-2xl text-red-400 cursor-pointer hover:scale-110 transition "
            >
              <RiDeleteBin6Line />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
