import User from "../models/user.js";
import Rating from "../models/rating.js";
import Counter from "../models/counter.js";

//GET HANDLER - Returns all users documents
export const getUsers = (req, res) => {
  User.find({})
    .then(function (users) {
      res.send(users);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//POST HANDLER - Inserts a new user document
export const createUser = (req, res) => {
  const user = new User({
    name: req.body.name,
    last: req.body.last,
    age: req.body.age,
    email: req.body.email,
    gender: req.body.gender,
    userId: getSequenceNextValue("users").toString(),
  });
  user
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//GET BY ID HANDLER - Returns a user by ID
export const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(function (found) {
      res.send(found);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - Deletes a user by ID
export const deleteUser = (req, res) => {
  const { id } = req.params;
  User.deleteOne({ _id: id })
    .then(() => {
      res.send(`User with id: ${id} deleted from database`);
    })
    .catch((err) => {
      res.json({ message: err });
    });
  //Deletes ratings associated to the deleted user
  Rating.deleteMany({ ratedBy: id }).catch((err) => {
    res.json({ message: err });
  });
};

//PATCH BY ID HANDLER - Updates a user by ID and by specific fields stored in HTTP request body
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, last, age, email, gender } = req.body;

  if (name)
    User.updateOne({ _id: id }, { $set: { name: name } })
      .then(() => {
        res.send(`User with id: ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (last)
    User.updateOne({ _id: id }, { $set: { last: last } })
      .then(() => {
        res.send(`User with id: ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (age)
    User.updateOne({ _id: id }, { $set: { age: age } })
      .then(() => {
        res.send(`User with id: ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (email)
    User.updateOne({ _id: id }, { $set: { email: email } })
      .then(() => {
        res.send(`User with id: ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (gender)
    User.updateOne({ _id: id }, { $set: { gender: gender } })
      .then(() => {
        res.send(`User with id: ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
};

function getSequenceNextValue(seqName) {
  Counter.updateOne({ name: seqName }, { $inc: { seqNumber: 1 } }).then(
    Counter.find({ name: seqName }).then((found) => {
      console.log(found);
      return found.seqNumber;
    })
  );
}
