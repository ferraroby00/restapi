import Film from "../models/film.js";
import Rating from "../models/rating.js";

//GET HANDLER - Returns all movies documents
export const getFilms = (req, res) => {
  Film.find({})
    .then(function (films) {
      res.send(films);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//POST HANDLER - Inserts a new movie document
export const insertMovie = (req, res) => {
  const film = new Film({
    title: req.body.title,
    year: req.body.year,
    genre: req.body.genre,
  });
  film
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//GET BY ID HANDLER - Returns a movie by ID
export const getFilm = (req, res) => {
  const { id } = req.params;
  Film.findById(id)
    .then(function (found) {
      res.send(found);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - Deletes a movie by ID
export const deleteFilm = (req, res) => {
  const { id } = req.params;
  Film.deleteOne({ _id: id })
    .then(() => {
      res.send(`Film with the id: ${id} deleted from the database`);
    })
    .catch((err) => {
      res.json({ message: err });
    });
  //Deletes ratings associated to the deleted film
  Rating.deleteMany({ filmId: id }).catch((err) => {
    res.json({ message: err });
  });
};

//PATCH BY ID HANDLER - Updates a movie by ID and by specific fields stored in HTTP request body
export const updateFilm = (req, res) => {
  const { id } = req.params;
  const { title, year, genre } = req.body;

  if (title)
    Film.updateOne({ _id: id }, { $set: { title: title } })
      .then(() => {
        res.send(`Film with the id ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (year)
    Film.updateOne({ _id: id }, { $set: { year: year } })
      .then(() => {
        res.send(`Film with the id ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  if (genre)
    Film.updateOne({ _id: id }, { $set: { genre: genre } })
      .then(() => {
        res.send(`Film with the id ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
};
