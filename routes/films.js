import express from "express";
const router = express.Router();
import {
  getFilms,
  insertMovie,
  getFilm,
  deleteFilm,
  updateFilm,
} from "../controllers/films.js";

//GET ALL FILMS
router.get("/", getFilms);

//INSERT A NEW MOVIE
router.post("/", insertMovie);

//GET FILM BY ID
router.get("/:id", getFilm);

//DELETE FILM BY ID
router.delete("/:id", deleteFilm);

//UPDATE USER BY ID
router.patch("/:id", updateFilm);

export default router;
