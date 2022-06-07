import User from "../models/user.js";
import Rating from "../models/rating.js";
import Movies from "../models/movies.js";

let counter;

// Definition of user preference matrix
let matr;

//Inits user matrix
function initMatrix(found) {
  function start(mList) {
    //Inits a square Matrix [mList.length] x [mList.length]
    matr = Array(mList.length).fill().map(() => Array(mList.length).fill());
    console.log(matr);
    //If users has already registered movie preferences then push scores in matrix
    if (found.preferences.length !== 0) {
      found.preferences.forEach((e) => {
        console.log("Pushed score in: ["+mList.indexOf(mList.find((element) => element.movieId === e.choice1))+"]["+mList.indexOf(mList.find((element) => element.movieId === e.choice2))+"]");
        //If user preference matches the first option then push 1, if it matches the second one then push 0
        if (e.choice1 === e.user) { matr[mList.indexOf(mList.find((element) => element.movieId === e.choice1))][mList.indexOf(mList.find((element) => element.movieId === e.choice2))] = 1; }
        else { matr[mList.indexOf(mList.find((element) => element.movieId === e.choice1))][mList.indexOf(mList.find((element) => element.movieId === e.choice2))] = 0; }
      })
      //console.log(matr);
    }
  }

  // Gets an array that contains the full movieId list
  Movies.find({}, { movieId: 1, _id: 0 }, (err, docs) => {
    //Invokes the function to init the user matrix
    start(docs);
  });

  // DEMO TRIAL
  /*function start(mList) {
    matr = Array(8).fill().map(() => Array(8).fill());
    console.log(matr);
    for (let i = 0; i < 4; i++) {
      console.log(mList.indexOf(mList.find((element) => element.movieId === found.preferences[i].choice1)) + " --- " + mList.indexOf(mList.find((element) => element.movieId === found.preferences[i].choice2)));
      if (found.preferences[i].choice1 === found.preferences[i].user) { matr[mList.indexOf(mList.find((element) => element.movieId === found.preferences[i].choice1))][mList.indexOf(mList.find((element) => element.movieId === found.preferences[i].choice2))] = 1; }
      else { matr[mList.indexOf(mList.find((element) => element.movieId === found.preferences[i].choice1))][mList.indexOf(mList.find((element) => element.movieId === found.preferences[i].choice2))] = 0; }
    }
    console.log(matr);
  }

  Movies.find({}, { movieId: 1, _id: 0 }, (err, docs) => {
    start([
      { movieId: "36529" },
      { movieId: "26409" },
      { movieId: "12" },
      { movieId: "3" },
      { movieId: "2" },
      { movieId: "2152" },
      { movieId: "37" },
      { movieId: "2352" },
    ]);
  });*/

}

//GET HANDLER - returns all users documents
export const getUsers = (req, res) => {
  //if the URL contains a query string it has to be redirected to users/uname
  if (req.query.uname) {
    counter = 0;
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

//POST HANDLER - inserts a new user document
export const createUser = (req, res) => {
  function add(numUser) {
    const user = new User({
      name: req.body.name,
      last: req.body.last,
      age: req.body.age,
      email: req.body.email,
      gender: req.body.gender,
      username: req.body.username,
      userId: numUser + 1,
    });
    user
      .save()
      .then(() => {
        //returns to homepage after successful registration (flag: 1 needed to display success message in home.ejs)
        res.render("home", { flag: 1 });
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }

  //gets number of users already registered and increment by 1 to obtain new userId
  User.countDocuments({}, (err, count) => {
    add(count);
  });
};

//POST HANDLER - randomically generate movie pairs
export const getPreferences = (req, res) => {
  //async function to exec the query: the controller stops until each query gets data
  async function funzione(trovato) {
    //generating random indexes for the movieIds array
    const rand1 = "" + Math.floor(Math.random() * (trovato.length - 0) + 0);
    const rand2 = "" + Math.floor(Math.random() * (trovato.length - 0) + 0);
    await Movies.findOne({ movieId: trovato[rand1].movieId }).then((found) => {
      res.locals.film_one = found;
    });
    await Movies.findOne({ movieId: trovato[rand2].movieId }).then((found) => {
      res.locals.film_two = found;
    });
    res.locals.count = counter;
    console.log(res.locals.count);
    res.locals.user = req.params.uname;
    res.render("preferences");
  }
  //query to extract the full list of movieIds
  Movies.find({}, { movieId: 1, _id: 0 }).then((found) => {
    //invokes the actual controller
    console.log(found);
    funzione(found);
  });
};

//PREFERENCE POST HANDLER
export const postPreference = (req, res) => {
  //creating the object to be stored in user
  let obj = {
    choice1: req.body.movie_one,
    choice2: req.body.movie_two,
    user: req.body.opz,
  };
  console.log("Utente che sta esprimendo preferenza: " + req.params.uname);
  //finding user based on the reference passed by URL
  User.findOne({ username: req.params.uname }).then((found) => {
    console.log(found);
    //pushing new preference object in user document
    found.preferences.push(obj);
    console.log(found.preferences);
    //updating the user overriding the array
    User.updateOne(
      { username: req.params.uname },
      { $set: { preferences: found.preferences } }
    ).then(() => {
      counter = counter + 1;
    });
  });
  //redirection to the preference view
  res.redirect("/users/" + req.params.uname + "/preferences");
};

//GET BY USERNAME HANDLER - returns a user by username
export const getUser = (req, res) => {
  function execute(user) {
    console.log("Utente:" + user);
    res.locals.user = user;
    res.locals.title1 = undefined;
    res.locals.title2 = undefined;
    initMatrix(user);
    res.render("loggedUser", { user: user });
  }
  const { uname } = req.params;
  User.findOne({ username: uname })
    .then(function (found) {
      execute(found);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - deletes a user by ID
export const deleteUser = (req, res) => {
  const { uname } = req.params;
  User.deleteOne({ username: uname })
    .then(() => {
      res.send(`${username} eliminato`);
    })
    .catch((err) => {
      res.json({ message: err });
    });
  //deletes ratings associated to the deleted user
  Rating.deleteMany({ ratedBy: id }).catch((err) => {
    res.json({ message: err });
  });
};

//PATCH BY ID HANDLER - updates a user by username and by specific fields stored in HTTP request body
export const updateUser = (req, res) => {
  let success = false;
  const { uname } = req.params;
  const { name, last, age, email, gender } = req.body;
  //checks if every fild is valid and if so applies the update (flag: 2 needed to display success message in home.ejs)
  if (name)
    User.updateOne({ username: uname }, { $set: { name: name } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (last)
    User.updateOne({ username: uname }, { $set: { last: last } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (age)
    User.updateOne({ username: uname }, { $set: { age: age } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (email)
    User.updateOne({ username: uname }, { $set: { email: email } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (gender)
    User.updateOne({ username: uname }, { $set: { gender: gender } })
      .then(() => {
        success = true;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (success === true) {
    res.render("home", { flag: 2 });
  }
};
