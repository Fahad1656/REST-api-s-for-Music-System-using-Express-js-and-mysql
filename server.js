/* eslint-disable no-undef */
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";

//import connectDatabase from "./config/db.config.js";
import authRoute from "./route/auth.route.js";
import musicRoute from "./route/music.route.js";

 
const port = process.env.port || 3000;
const app = express();

app.use(session({ secret: " sss" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// app.use((req, res, next) => {
//   console.log("Headers:", req.headers);
//   next();
// });

app.use("/api/auth", authRoute);
app.use("/api/music", musicRoute)

app.use("/", (req, res) => {
  return res.send("Server is running.........");
});

app.listen(port, () => {
  //connectDatabase();
  console.log("USERNAME:", process.env.USER_NAME);
  console.log(`server is running at ${port}`);
});

