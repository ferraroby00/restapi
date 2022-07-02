import express from "express";
import methodOverride from "method-override";
import {
  getAllRatings,
  insertRating,
  getRating,
  deleteRating,
  updateRating,
} from "../controllers/ratings.js";

const router = express.Router();

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//get all ratings
router.get("/", getAllRatings);

//get rating by Id
router.get("/:id", getRating);

//insert new rating
router.post("/", insertRating);

//delete rating by Id
router.delete("/:id", deleteRating);

//update rating by Id
router.patch("/:id", updateRating);

export default router;