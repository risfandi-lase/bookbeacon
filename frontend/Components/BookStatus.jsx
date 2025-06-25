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

function BookStatus() {
  return (
    <div className="bg-base-200 text-base-content p-8 w-full flex flex-col items-start font-lexend ">
      {" "}
      <p className="text-3xl font-[300] mb-7 font-lexend">BookStatus</p>
      <p className="mb-4 text-xl">Completed</p>
      <div className="w-40 mb-10 flex gap-4">
        <img src={littlea} alt="" className="shadow-lg shadow-black/50" />
        <img src={illbe} alt="" className="shadow-lg shadow-black/50" />
      </div>
      <p className="mb-4 mt-4 text-xl">Reading</p>
      <div>
        <div className="w-40 shadow-lg shadow-black/50 mb-10">
          <img src={viving} alt="" />
        </div>
      </div>
      <p className="mb-4 mt-4 text-xl">On Hold</p>
      <div>
        <div className="w-40 flex gap-4">
          <img src={celebrate} alt="" className=" shadow-lg shadow-black/50 mb-10" />
          <img src={thesecret} alt=""  className=" shadow-lg shadow-black/50 mb-10" />
          <img src={it} alt=""  className=" shadow-lg shadow-black/50 mb-10" />
        </div>
      </div>
    </div>
  );
}

export default BookStatus;
