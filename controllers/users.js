import User from "../models/user.js";
import Rating from "../models/rating.js";
import Movies from "../models/movie.js";
import * as movieController from "../controllers/movies.js";
import Link from "../models/link.js";
import fetch from "node-fetch";
let counter;
let popularity;

/*async function initContext(found) {
  let mList,
    max,
    toPush = {};

  await Rating.aggregate([
    { $group: { _id: "$movieId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]).then((result) => {
    console.log(result);
    max = result[0].count;
  });

  console.log("Massimo: " + max);

  await Movies.find({}, { movieId: 1, _id: 0 }).then((list) => (mList = list));

  console.log(mList);
  popularity = [];
  console.log("Popularity-first: " + popularity);
  //OK

  await mList.forEach(function (el) {
    Rating.aggregate([
      {
        $match: {
          movieId: el.movieId,
        },
      },
      {
        $count: "ratings",
      },
    ])
      .exec()
      .then((value) => {
        if (value[0]) {
          return Movies.updateOne(
            { movieId: el.movieId },
            {
              $set: {
                popularity_index: parseFloat(
                  (value[0].ratings / max).toFixed(3)
                ),
              },
            }
          ).exec();
        }
      })
      .then(() => console.log(`Popularity for ${el.movieId} updated`));
  });
  await initVector();
}
*/

//GET HANDLER - returns all users documents
export const getAllUsers = (req, res) => {
  //if the URL contains a query string it has to be redirected to users/uname
  if (req.query.uname) {
    //Inits selection counter
    counter = 0;
    res.redirect("/users/" + req.query.uname);
  } else {
    User.find({})
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        res.json({ message: err });
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
      //Saves user in MongoDB
      user.save();
    })
    .then(() => {
      console.log("Nuovo utente inserito");
      //returns to homepage after successful registration
      res.render("home");
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//PREFERENCES POST HANDLER - randomically generate movie pairs based on popularity array
export const getPreferences = async (req, res) => {
  //generating random indexes for the movieIds most popular array (popularity)
  const rand1 = "" + Math.floor(Math.random() * (popularity.length - 0) + 0);
  const rand2 = "" + Math.floor(Math.random() * (popularity.length - 0) + 0);
  //Queries to get two random films to choose
  await Movies.findOne({ movieId: popularity[rand1].movieId }).then((found) => {
    res.locals.film_one = found;
  });
  await Movies.findOne({ movieId: popularity[rand2].movieId }).then((found) => {
    res.locals.film_two = found;
  });
  /*await Link.findOne({ movieId: popularity[rand1].movieId }).then((found) => {
    res.locals.imdb_one = found.imdbId;
  });
  await Link.findOne({ movieId: popularity[rand2].movieId }).then((found) => {
    res.locals.imdb_two = found.imdbId;
  });*/
  /*await fetch(`https://imdb-api.com/en/API/Posters/k_4zp4f51i/tt${res.locals.imdb_one}`).then((response) => {
    console.log(response.status);
    console.log(response.ok)
    response.json();
  }).then((data) => {
    console.log(data);
  })*/
  //Saves the preference counter into EJS template
  res.locals.count = counter;
  console.log("Contatore preferenze: " + res.locals.count);
  //Saves username into EJS template
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
      //Updates the counter
      counter = counter + 1;
      //redirection to the getPreference
      res.redirect("/users/" + req.params.uname + "/preferences");
    })
    .catch((err) => {
      res.json(err);
    });
};

//Values popularity vector
async function initVector() {
  let result = await movieController.getMovieList(1);
  //Filters result array based on a specific value
  popularity = result.filter((element) => element.popularity_index > 0.1);
  //console.log(popularity);
}

//GET BY USERNAME HANDLER - returns a user by username
export const getUser = (req, res) => {
  const { uname } = req.params;
  User.findOne({ username: uname })
    .then(async (user) => {
      res.locals.user = user;
      res.locals.title1 = undefined;
      res.locals.title2 = undefined;
      await initVector();
      //console.log(popularity);
      res.render("loggedUser", { user: user });
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - deletes a user by ID
export const deleteUser = (req, res) => {
  User.deleteOne({ username: req.params.uname })
    .then(() => {
      console.log("Utente eliminato");
      res.redirect("/home");
    })
    .catch((err) => {
      res.json({ message: err });
    });
  //deletes ratings associated to the deleted user
  // Rating.deleteMany({ ratedBy: id }).catch((err) => {
  //   res.json({ message: err });
  // });
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
      .catch((err) => {
        res.json({ message: err });
      });
  }
  if (last) {
    await User.updateOne({ username: uname }, { $set: { last: last } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
  if (age) {
    await User.updateOne({ username: uname }, { $set: { age: age } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
  if (email) {
    await User.updateOne({ username: uname }, { $set: { email: email } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
  if (gender) {
    await User.updateOne({ username: uname }, { $set: { gender: gender } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
  //returns to homepage after successful user info update
  if (success === true) {
    res.render("home");
  }
};
