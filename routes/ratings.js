import express from "express";
const router = express.Router();
import {
  getAll,
  insertRating,
  getRating,
  deleteRating,
  updateRating,
} from "../controllers/ratings.js";

//GET ALL RATINGS
router.get("/", getAll);

//INSERT A NEW RATING
router.post("/", insertRating);

//GET RATING BY FILM ID
router.get("/:id", getRating);

//DELETE RATING BY ID
router.delete("/:id", deleteRating);

//UPDATE USER BY ID
router.patch("/:id", updateRating);

export default router;
