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

router.use(methodOverride('_method', {
  methods: ["GET", "POST"]
}));

//get all users
router.get("/", getUsers);

//insert user
router.post("/", createUser);

//get user by username
router.get("/:uname", getUser);

//get to pair-wise preferences by username
router.get("/:uname/preferences", getPreferences);

//send preference object contaning the two options and the choice, by username
router.post("/:uname/preferences", postPreference);

//delete user by Id
router.delete("/:uname", deleteUser);

//update user by Id
router.put("/:uname", updateUser);

export default router;
