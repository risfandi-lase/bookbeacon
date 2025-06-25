import { useParams, useNavigate, useLocation } from "react-router-dom";
import React from "react";

function BookDetails({ books }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const bookFromState = location.state?.book;
  const book = bookFromState || books.find((b) => b.id === Number(id));

  if (!book) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Book not found.</p>
        <button className="btn ml-4" onClick={() => navigate("/")}>
          Go home
        </button>
      </div>
    );
  }

  return (
    /* add relative -> allows absolute children */
    <div className="relative w-full h-screen flex items-center justify-center bg-base-200">
      {/* ─── Back button in the top-left ─── */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm absolute top-4 left-4"
      >
        ⟵ Back
      </button>

      {/* book content in the centre */}
      <div className="flex">
        <img
          src={book.image}
          alt={book.title}
          className="h-150 w-100 mr-20 shadow-lg"
        />

        <div className="flex flex-col justify-center mr-100">
          <h2 className="text-4xl mb-4 font-lexend">{book.title}</h2>
          <p className="text-xl text-gray-500">{book.author}</p>

          <fieldset className="fieldset font-lexend">
            <select defaultValue="Status" className="select w-35 mt-12 mb-5 ">
              <option disabled={true}>Status</option>
              <option>Reading</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
          </fieldset>

          <div className="rating ">
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="1 star"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="2 star"
              defaultChecked
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="3 star"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="4 star"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="5 star"
            />
          </div>

          <fieldset className="fieldset font-lexend mt-5 text-sm">
            <legend className="fieldset-legend">Comment</legend>
            <textarea
              className="textarea h-24 text-xs"
              placeholder="Your text here.."
            ></textarea>
          </fieldset>

          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm top-4 left-4 font-lexendbtn btn-neutral btn-outline opacity-30 w-24 mt-6 font-lexend text-xs font-[500]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
