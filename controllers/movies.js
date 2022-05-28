import Movie from "../models/movies.js";
import Rating from "../models/rating.js";

//GET HANDLER - Returns all movies documents
export const getMovies = (req, res) => {
  Movie.find({})
    .then(function (films) {
      res.send(films);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//POST HANDLER - Inserts a new movie document
export const insertMovie = (req, res) => {
  const movie = new Movie({
    movieId: req.body.movieId,
    title: req.body.title,
    genres: req.body.genres,
  });
  movies
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//GET BY ID HANDLER - Returns a movie by ID
export const getMovie = (req, res) => {
  const { id } = req.params;
  Movie.find({ movieId: id })
    .then(function (found) {
      res.send(found);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - Deletes a movie by ID
export const deleteMovie = (req, res) => {
  const { id } = req.params;
  Movie.deleteOne({ movieId: id })
    .then((deleted) => {
      res.send(`Film: ${deleted.title} deleted from database`);
    })
    .catch((err) => {
      res.json({ message: err });
    });

  /*
  //Deletes ratings associated to the deleted film
  Rating.deleteMany({ filmId: id }).catch((err) => {
    res.json({ message: err });
  });*/
};

//PATCH BY ID HANDLER - Updates a movie by ID and by specific fields stored in HTTP request body
export const updateMovie = (req, res) => {
  const { id } = req.params;
  const { title, genres } = req.body;

  if (title)
    Film.updateOne({ movieId: id }, { $set: { title: title } })
      .then((updated) => {
        res.send(`Film: ${updated.title} updated successfully`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (genres)
    Film.updateOne({ movieId: id }, { $set: { genres: genre } })
      .then((updated) => {
        res.send(`Film: ${updated.title} updated successfully`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
};
