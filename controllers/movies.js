import Movie from "../models/movie.js";

//gets movies array
export async function getMovieList(flag) {
  let mList;
  if (flag === 1) {
    await Movie.find({}, { movieId: 1, prob_index: 1, _id: 0 }).then((docs) => {
      mList = docs;
    });
  } else if (flag === 0) {
    await Movie.find({}, { movieId: 1, _id: 0 })
      .then((docs) => {
        mList = docs;
      })
      .catch(() => {
        mList = { error: "Cannot get movie list" };
      });
  } else {
    await Movie.find({}, { movieId: 1, title: 1, _id: 0 })
      .then((docs) => {
        mList = docs;
      })
      .catch(() => {
        mList = { error: "Cannot get movie list" };
      });
  }
  return mList;
}

//GET HANDLER - returns all movies documents
export const getAllMovies = (req, res) => {
  Movie.find({})
    .then((films) => {
      res.send(films);
    })
    .catch(() => {
      res.json({ message: "Cannot get movies" });
    });
};

//POST HANDLER - inserts a new movie document
export const insertMovie = (req, res) => {
  const movie = new Movie({
    movieId: req.body.movieId,
    title: req.body.title,
    genres: req.body.genres,
  });
  movie
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json({ message: "Cannot add movie" });
    });
};

//GET BY ID HANDLER - returns a movie by Id
export const getMovie = (req, res) => {
  const { id } = req.params;
  Movie.find({ movieId: id })
    .then((found) => {
      res.send(found);
    })
    .catch(() => {
      res.json({ message: "Cannot find movie" });
    });
};

//DELETE BY ID HANDLER - deletes a movie by Id
export const deleteMovie = (req, res) => {
  const { id } = req.params;
  Movie.deleteOne({ movieId: id })
    .then(() => {
      res.send(`Movie deleted from database`);
    })
    .catch(() => {
      res.json({ message: "Cannot delete movie" });
    });
};

//PATCH BY ID HANDLER - updates a movie by Id and by specific fields stored in HTTP request body
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, genres } = req.body;
  if (title)
    Movie.updateOne({ movieId: id }, { $set: { title: title } })
      .then(() => {
        res.send(`Movie title updated successfully`);
      })
      .catch(() => {
        res.json({ message: "Cannot update movie title" });
      });
  if (genres)
    Movie.updateOne({ movieId: id }, { $set: { genres: genres } })
      .then(() => {
        res.send(`Movie genre updated successfully`);
      })
      .catch(() => {
        res.json({ message: "Cannot update movie genre" });
      });
};