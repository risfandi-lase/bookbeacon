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

    <div className="w-40 mb-10 flex gap-4">
      <p>Completed</p>
  <img src={littlea} alt="" className="shadow-lg shadow-black/50" />
  <img src={illbe} alt="" className="shadow-lg shadow-black/50" />
  <img src={it} alt="" className="shadow-lg shadow-black/50" />
  <img src={feel} alt="" className="shadow-lg shadow-black/50" />
</div>


      <div>
        <p>Reading</p>
                <div className="w-40 shadow-lg shadow-black/50 mb-10">
          <img src={littlea} alt="" />
        </div>

      </div>

      <div>
        <p>On Hold</p>
                <div className="w-40 shadow-lg shadow-black/50 mb-10">
          <img src={littlea} alt="" />
        </div>

      </div>



    </div>
  );
}

export default BookStatus;
