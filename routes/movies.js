import express from "express";
const router = express.Router();
import {
  getMovies,
  insertMovie,
  getMovie,
  deleteMovie,
  updateMovie,
} from "../controllers/movies.js";

//get all movies
router.get("/", getMovies);

//insert movie
router.post("/", insertMovie);

//get movie by Id
router.get("/:id", getMovie);

//delete movie by Id
router.delete("/:id", deleteMovie);

//update movie by Id
router.patch("/:id", updateMovie);

export default router;
