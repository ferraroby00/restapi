import express from "express";
const router = express.Router();
import {
  getAll,
  insertRating,
  getRating,
  deleteRating,
  updateRating,
} from "../controllers/ratings.js";

//get all ratings
router.get("/", getAll);

//insert new rating
router.post("/", insertRating);

//get rating by Id
router.get("/:id", getRating);

//delete rating by Id
router.delete("/:id", deleteRating);

//update rating by Id
router.patch("/:id", updateRating);

export default router;
