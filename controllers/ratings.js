import Rating from "../models/rating.js";
import mongoose from "mongoose";
import Movie from "../models/movie.js";

//GET HANDLER - returns all movies documents
export const getAllRatings = (req, res) => {
  Rating.aggregate([
    { $match: { rating: { $exists: true } } },
    { $group: { _id: "$filmId", averageRating: { $avg: "$rating" } } },
    {
      $lookup: {
        from: "films",
        localField: "_id",
        foreignField: "_id",
        as: "join",
      },
    },
    {
      $project: {
        movieID: "$_id",
        averageRating: 1,
        movieName: { $arrayElemAt: ["$join.title", 0] },
      },
    },
    {
      $project: {
        movieName: 1,
        averageRating: 1,
      },
    },
  ])
    .then(function (el) {
      res.send(el);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//POST HANDLER - inserts a new rating document and updates movie popularity_index
export const insertRating = (req, res) => {
  let max;
  let rating;
  //Finds movieId associated to Movie Title from the view
  Movie.findOne({ title: req.body.movieTitle })
    .then((result) => {
      movieIdTemp = result.movieId;
      //Gets the maximum count used in normalization
      return Rating.aggregate([
        { $group: { _id: "$movieId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]);
    })
    .then((result) => {
      //Creates and saves rating object posted
      console.log(result);
      max = result[0].count;
      console.log(max);
      rating = new Rating({
        userId: req.body.userId,
        movieId: movieIdTemp,
        rating: req.body.movieRating,
      });
      return rating.save();
    })
    .then(() => {
      //Counts ratings related to movieId
      return Rating.aggregate([
        {
          $match: {
            movieId: movieIdTemp,
          },
        },
        {
          $count: "ratings",
        },
      ]).exec();
    })
    .then((value) => {
      console.log(value);
      //Updates popularity_index
      return Movie.updateOne(
        { movieId: movieIdTemp },
        {
          $set: {
            popularity_index: parseFloat((value[0].ratings / max).toFixed(3)),
          },
        }
      );
    })
    .then((updateLog) => {
      console.log(updateLog);
      res.end();
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//GET BY ID HANDLER - returns a rating by film ID
export const getRating = (req, res) => {
  const { id } = req.params;
  Rating.aggregate([
    { $match: { rating: { $exists: true } } },
    { $group: { _id: "$filmId", averageRating: { $avg: "$rating" } } },
    {
      $lookup: {
        from: "films",
        localField: "_id",
        foreignField: "_id",
        as: "join",
      },
    },
    {
      $project: {
        movieID: "$_id",
        averageRating: 1,
        movieName: { $arrayElemAt: ["$join.title", 0] },
      },
    },
    {
      $project: {
        movieName: 1,
        averageRating: 1,
      },
    },
    { $match: { _id: mongoose.Types.ObjectId(id) } },
  ])
    .then(function (found) {
      res.send(found);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//DELETE BY ID HANDLER - deletes a rating by ID
export const deleteRating = (req, res) => {
  const { id } = req.params;
  Rating.deleteOne({ _id: id })
    .then(() => {
      res.send(`Rating with id: ${id} deleted from database`);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//PATCH BY ID HANDLER - updates a movie by ID and by specific fields stored in HTTP request body
export const updateRating = (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (rating)
    Rating.updateOne({ _id: id }, { $set: { rating: rating } })
      .then(() => {
        res.send(`Rating with id: ${id} updated`);
      })
      .catch((err) => {
        res.json({ message: err });
      });
};
