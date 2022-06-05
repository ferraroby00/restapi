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
  res.locals.flag = 0;
  res.render("home");
});

//connection to database
mongoose.connect(
  "mongodb+srv://restapi:tesi_restAPI@thesis.mvjviod.mongodb.net/ufr"
);
const con = mongoose.connection;
con.on("open", () => {
  console.log("Connesso al database");
});
con.on("error", () => {
  console.log("Errore nella connessione al database");
});

//server listening on port PORT
app.listen(PORT, () =>
  console.log(`Server in ascolto alla porta: http://localhost:${PORT}`)
);
