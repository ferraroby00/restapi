import express from "express";
import methodOverride from "method-override";
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getPreferences,
  postPreference,
} from "../controllers/users.js";

const router = express.Router();

router.use(methodOverride("patch", "delete", {
  methods: ["POST", "POST"]
}));

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
router.patch("/:uname", updateUser);

export default router;
