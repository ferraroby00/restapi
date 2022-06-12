import Movie from "../models/movie.js";
import Rating from "../models/rating.js";

//GET HANDLER - returns all movies documents
export const getMovies = (req, res) => {
  Movie.find({})
    .then((films) => {
      res.send(films);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//Function that gets movies array
export async function getMovieList(flag) {
  let mList;
  if (flag === 1) {
    await Movie.find({}, { movieId: 1, popularity_index: 1, _id: 0 }).then(
      (docs) => {
        mList = docs;
      }
    );
  } else {
    await Movie.find({}, { movieId: 1, _id: 0 })
      .then((docs) => {
        mList = docs;
      })
      .catch((err) => (mList = { error: err }));
  }
  return mList;
}

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
    .catch((err) => {
      res.json({ message: err });
    });
};

//GET BY ID HANDLER - returns a movie by Id
export const getMovie = (req, res) => {
  const { id } = req.params;
  Movie.find({ movieId: id })
    .then((found) => {
      res.send(found);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - deletes a movie by Id
export const deleteMovie = (req, res) => {
  const { id } = req.params;
  Movie.deleteOne({ movieId: id })
    .then((deleted) => {
      res.send(`Film deleted from database`);
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

//PATCH BY ID HANDLER - updates a movie by Id and by specific fields stored in HTTP request body
export const updateMovie = (req, res) => {
  const { id } = req.params;
  const { title, genres, popularity_index } = req.body;

  if (title)
    Movie.updateOne({ movieId: id }, { $set: { title: title } })
      .then((updated) => {
        res.send(`Film updated successfully`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (genres)
    Movie.updateOne({ movieId: id }, { $set: { genres: genres } })
      .then((updated) => {
        res.send(`Film updated successfully`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (popularity_index) {
    Movie.updateOne(
      { movieId: id },
      { $set: { popularity_index: popularity_index } }
    )
      .then((updated) => {
        res.send(`Film updated successfully`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
};
