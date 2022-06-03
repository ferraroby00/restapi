import User from "../models/user.js";
import Rating from "../models/rating.js";
import Movies from "../models/movies.js";
//import Counter from "../models/counter.js";

//GET HANDLER - Returns all users documents
export const getUsers = (req, res) => {
  //If the URL contains a query string it has to be redirected to users/uname
  if (req.query.uname) {
    res.redirect("/users/" + req.query.uname);
  } else {
    User.find({})
      .then(function (users) {
        res.send(users);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
};

/*function getSequenceNextValue(seqName) {
  Counter.updateOne({ name: seqName }, { $inc: { seqNumber: 1 } }).then();
  Counter.findOne({ name: seqName }, (error, found) => {
    console.log(found);
    counter = found.seqNumber;
    console.log()
  });
}*/

//POST HANDLER - Inserts a new user document
export const createUser = (req, res) => {
  const user = new User({
    name: req.body.name,
    last: req.body.last,
    age: req.body.age,
    email: req.body.email,
    gender: req.body.gender,
    userId: req.body.userId,
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

export const getPreferences = (req, res) => {
  async function funzione(trovato) {
    const rand1 = "" + Math.floor(Math.random() * (trovato.length - 0) + 0);
    const rand2 = "" + Math.floor(Math.random() * (trovato.length - 0) + 0);
    await Movies.findOne({ movieId: trovato[rand1].movieId }).then((found) => {
      res.locals.film_one = found;
    });
    await Movies.findOne({ movieId: trovato[rand2].movieId }).then((found) => {
      res.locals.film_two = found;
    });
    res.locals.user = req.params.uname;
    res.render("preferences");
  }

  //let obj = { choice1: rand1, choice2: rand2, user: null };
  Movies.find({}, { movieId: 1, _id: 0 }).then((found) => {
    funzione(found);
  });

  /**/
};

//PREFERENCE POST HANDLER
export const postPreference = (req, res) => {
  // Creating the object to be stored in user
  let obj = {
    choice1: req.body.movie_one,
    choice2: req.body.movie_two,
    user: req.body.opz,
  };
  console.log("Utente che sta esprimendo preferenza: "+req.params.uname);
  // Finding user based on the reference passed by URL
  User.findOne({ username: req.params.uname }).then((found) => {
    console.log(found);
    // Pushing new preference object in user document
    found.preferences.push(obj);
    console.log(found.preferences);
    // Updating the user overriding the array
    User.updateOne(
      { username: req.params.uname },
      { $set: { preferences: found.preferences } }
    ).then(() => {});
  });
  // Redirection to the preference view
  res.redirect("/users/" + req.params.uname + "/preferences");
};

//GET BY ID HANDLER - Returns a user by email
export const getUser = (req, res) => {
  const { uname } = req.params;
  User.findOne({ username: uname })
    .then(function (found) {
      res.locals.user = found;
      res.locals.title1 = undefined;
      res.locals.title2 = undefined;
      res.redirect("/users/" + req.params.uname + "/preferences");
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
