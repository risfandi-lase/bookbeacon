import express from "express";
import dotenv from "dotenv";
import { db } from "./config/Database.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log("Database Connected");
} catch (error) {
  console.error(error);
}

app.use(cors({
  origin: '*',   // <– list or function, not '*'
                 // <– tells cors to add the header
}));


app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5000, () => {
  console.log(`Example app listening on port 5000`);
});
