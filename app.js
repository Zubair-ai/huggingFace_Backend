import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/Index.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-token, token, X-CSRF-Token, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.end();
  } else {
    next();
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/media", express.static(path.join(__dirname, "./media")));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
dotenv.config();

const env = process.env.NODE_ENV || "DEV";
const mongoURI =
  env === "DEV" ? process.env.MONGO_ATLAS_DEV : process.env.MONGO_ATLAS_DEV;
console.log("mongoURI", mongoURI);
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// routes
app.use("/api", router);

mongoose
  .connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log("Connected to Mongo Atlas");
    const port = process.env.PORT || 3001;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
