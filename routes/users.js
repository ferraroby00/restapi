import express from "express";
import methodOverride from "method-override";
import {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getPreferences,
  postPreference,
} from "../controllers/users.js";

const router = express.Router();

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//get all users
router.get("/", getAllUsers);

//get user by username
router.get("/:uname", getUser);

//insert user
router.post("/", createUser);

//get to pair-wise preferences by username
router.get("/:uname/preferences", getPreferences);

//send preference object contaning the two options and the choice, by username
router.post("/:uname/preferences", postPreference);

//delete user by Id
router.delete("/:uname", deleteUser);

//update user by Id
router.patch("/:uname", updateUser);

export default router;