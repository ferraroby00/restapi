import express from "express";
const router = express.Router();
import {
  getMovies,
  insertMovie,
  getMovie,
  deleteMovie,
  updateMovie,
} from "../controllers/movies.js";

//GET ALL FILMS
router.get("/", getMovies);

//INSERT A NEW MOVIE
router.post("/", insertMovie);

//GET FILM BY ID
router.get("/:id", getMovie);

//DELETE FILM BY ID
router.delete("/:id", deleteMovie);

//UPDATE USER BY ID
router.patch("/:id", updateMovie);

export default router;
