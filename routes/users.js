import express from 'express';
import {getUsers, createUser, getUser, deleteUser, updateUser} from '../controllers/users.js';
const router = express.Router();

//GET ALL USERS
router.get('/', getUsers);

//CREATE A NEW USER
router.post('/',createUser);

//GET USER BY ID
router.get('/:id', getUser);

//DELETE USER BY ID
router.delete('/:id', deleteUser);

//UPDATE USER BY ID
router.patch('/:id', updateUser);

//GET RATINGS
router.get('/ratings',/**/);

//GET RATING BY TITLE
router.get('/ratings/:title',/**/);

export default router;