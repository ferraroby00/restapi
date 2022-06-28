import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/users.js";
import ratingRoutes from "./routes/ratings.js";

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);
app.use("/ratings", ratingRoutes);

//homepage
app.get("/home", (req, res) => {
  res.locals.user = undefined;
  res.locals.title1 = undefined;
  res.locals.title2 = undefined;
  res.render("home");
});

//connection to database
mongoose.connect(
  "mongodb+srv://restapi:tesi_restAPI@thesis.mvjviod.mongodb.net/ufr"
);
mongoose.connection.on("open", () => {
  console.log("Connected to database");
});
mongoose.connection.on("error", () => {
  console.log("Error connecting to database");
});

//server listening on port PORT
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));