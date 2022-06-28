import express from "express";
import methodOverride from "method-override";
import {
  getAllMovies,
  insertMovie,
  getMovie,
  deleteMovie,
  updateMovie,
} from "../controllers/movies.js";

const router = express.Router();

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//get all movies
router.get("/", getAllMovies);

//get movie by Id
router.get("/:id", getMovie);

//insert movie
router.post("/", insertMovie);

//delete movie by Id
router.delete("/:id", deleteMovie);

//update movie by Id
router.patch("/:id", updateMovie);

export default router;