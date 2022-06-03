import express from "express";
const router = express.Router();
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getPreferences,
  postPreference,
} from "../controllers/users.js";

//get all users
router.get("/", getUsers);

//insert user
router.post("/", createUser);

//get to pair-wise preferences by username
router.get("/:uname/preferences", getPreferences);

//send preference object contaning the two options and the choice, by username
router.post("/:uname/preferences", postPreference);

//get user by username
router.get("/:uname", getUser);

//delete user by Id
router.delete("/:id", deleteUser);

//update user by Id
router.patch("/:id", updateUser);

export default router;
