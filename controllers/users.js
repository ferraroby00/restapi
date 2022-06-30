import User from "../models/user.js";
import Movies from "../models/movie.js";
import * as movieController from "../controllers/movies.js";
import Link from "../models/link.js";
import fetch from "node-fetch";

//Global variables
let counter;
let mList;
let toRate;

//GET HANDLER - returns all users documents
export const getAllUsers = (req, res) => {
  //if the URL contains a query string it has to be redirected to users/uname
  if (req.query.uname) {
    //init selection counter
    counter = 0;
    res.redirect("/users/" + req.query.uname);
  } else {
    User.find({})
      .then((users) => {
        res.send(users);
      })
      .catch(() => {
        res.json({ message: "Cannot get users" });
      });
  }
};

//USER POST HANDLER - inserts a new user document
export const createUser = (req, res) => {
  let user;
  let numUser;
  //gets number of users already registered and increment by 1 to obtain new userId
  User.countDocuments({})
    .then((count) => {
      numUser = count;
    })
    .then(() => {
      //creates the user object to save into MongoDB
      user = new User({
        name: req.body.name,
        last: req.body.last,
        age: req.body.age,
        email: req.body.email,
        gender: req.body.gender,
        username: req.body.username,
        userId: numUser + 1,
      });
    })
    .then(() => {
      //saves user in MongoDB
      user.save();
    })
    .then(() => {
      //returns to homepage after successful registration
      res.render("home");
    })
    .catch(() => {
      res.json({ message: "Cannot add user" });
    });
};

//PREFERENCES POST HANDLER - randomically generate movie pairs based on popularity array
export const getPreferences = async (req, res) => {
  res.locals.imdb_one = undefined;
  res.locals.imdb_two = undefined;
  console.log(getRandom());
  //generating random indexes for the movieIds most popular array (popularity)
  const rand1 = getRandom();
  const rand2 = getRandom();
  //queries to get two random films to choose
  await Movies.findOne({ movieId: rand1 }).then((found) => {
    res.locals.film_one = found;
  });
  await Movies.findOne({ movieId: rand2 }).then((found) => {
    res.locals.film_two = found;
  });
  await Link.findOne({ movieId: rand1 })
    .then((found) => {
      return fetch(
        "https://imdb-api.com/en/API/Posters/k_4zp4f51i/tt" + found.imdbId
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.posters.length !== 0) {
            res.locals.imdb_one = data.posters.filter(
              (element) => element.aspectRatio === 0.6666666666666666
            )[0].link;
            console.log(res.locals.imdb_one);
          }
        });
    })
    .then(() => {
      console.log("Got img 1");
    });
  await Link.findOne({ movieId: rand2 })
    .then((found) => {
      return fetch(
        "https://imdb-api.com/en/API/Posters/k_4zp4f51i/tt" + found.imdbId
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.posters.length !== 0) {
            res.locals.imdb_two = data.posters.filter(
              (element) => element.aspectRatio === 0.6666666666666666
            )[0].link;
            console.log(res.locals.imdb_two);
          }
        });
    })
    .then(() => {
      console.log("Got img 2");
    });
  //saves the preference counter into EJS template
  res.locals.count = counter;
  console.log("Contatore preferenze: " + res.locals.count);
  //saves username into EJS template
  res.locals.user = req.params.uname;
  res.render("preferences");
};

//PREFERENCE POST HANDLER - Pushes preference choice into user document in MongoDB
export const postPreference = (req, res) => {
  //creating the object to be stored in user
  let aux;
  let obj = {
    choice1: req.body.movie_one,
    choice2: req.body.movie_two,
    user: req.body.opz,
  };
  console.log("Utente che sta esprimendo preferenza: " + req.params.uname);
  //finding user based on the reference passed by URL
  User.findOne({ username: req.params.uname })
    .then((found) => {
      //pushing new preference object in user document
      found.preferences.push(obj);
      aux = found;
    })
    .then(() => {
      //updating the user overwriting the array
      return User.updateOne(
        { username: req.params.uname },
        { $set: { preferences: aux.preferences } }
      ).exec();
    })
    .then(() => {
      counter++;
      //redirection to the getPreference
      res.redirect("/users/" + req.params.uname + "/preferences");
    })
    .catch(() => {
      res.json({ message: "Cannot register preference" });
    });
};

//custom random functions that takes into consideration the probability of each item (movie)
function getRandom() {
  let num = Math.random(),
    s = 0,
    lastIndex = mList.length - 1;
  for (let i = 0; i < lastIndex; ++i) {
    s += mList[i].prob_index;
    if (num < s) {
      return mList[i].movieId;
    }
  }
  return mList[lastIndex].movieId;
}

//values popularity vector
async function initVectors(u) {
  toRate = [];
  mList = await movieController.getMovieList(1);
  let demo = await movieController.getMovieList(2);
  u.preferences.forEach((p) => {
    toRate.push(demo.find((el) => el.movieId === p.user));
  });
}

//GET BY USERNAME HANDLER - returns a user by username
export const getUser = (req, res) => {
  const { uname } = req.params;
  User.findOne({ username: uname })
    .then(async (user) => {
      if (user !== null) {
        await initVectors(user);
        res.render("loggedUser", { user: user, films: toRate });
      } else {
        res.render("home");
      }
    })
    .catch(() => {
      res.json({ message: "Cannot get user" });
    });
};

//DELETE BY ID HANDLER - deletes a user by ID
export const deleteUser = (req, res) => {
  User.deleteOne({ username: req.params.uname })
    .then(() => {
      console.log("Utente eliminato");
      res.redirect("/home");
    })
    .catch(() => {
      res.json({ message: "Cannot delete user" });
    });
};

//PATCH BY ID HANDLER - updates a user by username and by specific fields stored in HTTP request body
export const updateUser = async (req, res) => {
  let success = false;
  const { uname } = req.params;
  const { name, last, age, email, gender } = req.body;
  //checks if every field is valid and if so applies the update (flag: 2 needed to display success message in home.ejs)
  if (name) {
    await User.updateOne({ username: uname }, { $set: { name: name } })
      .then(() => {
        success = true;
      })
      .catch(() => {
        res.json({ message: "Cannot update user name" });
      });
  }
  if (last) {
    await User.updateOne({ username: uname }, { $set: { last: last } })
      .then(() => {
        success = true;
      })
      .catch(() => {
        res.json({ message: "Cannot update user surname" });
      });
  }
  if (age) {
    await User.updateOne({ username: uname }, { $set: { age: age } })
      .then(() => {
        success = true;
      })
      .catch(() => {
        res.json({ message: "Cannot update user age" });
      });
  }
  if (email) {
    await User.updateOne({ username: uname }, { $set: { email: email } })
      .then(() => {
        success = true;
      })
      .catch(() => {
        res.json({ message: "Cannot update user email" });
      });
  }
  if (gender) {
    await User.updateOne({ username: uname }, { $set: { gender: gender } })
      .then(() => {
        success = true;
      })
      .catch(() => {
        res.json({ message: "Cannot update user gender" });
      });
  }
  //returns to homepage after successful user info update
  if (success === true) {
    res.render("home");
  }
};