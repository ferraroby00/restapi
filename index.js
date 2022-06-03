import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/users.js";
import ratingRoutes from "./routes/ratings.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/movies", movieRoutes);

app.use("/users", userRoutes);

app.use("/ratings", ratingRoutes);

app.set("view engine", "ejs");

//homepage
app.get("/home", (req, res) => {
  res.locals.user = undefined;
  res.locals.title1 = undefined;
  res.locals.title2 = undefined;
  res.render("pair-wise");
});

//connection to database
mongoose.connect(
  "mongodb+srv://restapi:tesi_restAPI@thesis.mvjviod.mongodb.net/ufr"
);
const con = mongoose.connection;
con.on("open", () => {
  console.log("Connesso al databse");
});
con.on("error", () => {
  console.log("Errore nella connesione al database");
});

//server listening on port PORT
app.listen(PORT, () =>
  console.log(`Serve in ascolto alla porta: http://localhost:${PORT}`)
);
