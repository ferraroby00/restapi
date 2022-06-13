import Rating from "../models/rating.js";
import mongoose from "mongoose";
import { updateMovie } from "./movies.js";

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

//POST HANDLER - inserts a new rating document
export const insertRating = (req, res) => {
  //let max;
  Rating.aggregate([
    { $group: { _id: "$movieId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]).then((result) => {
    console.log(result);
    res.locals.max = result[0].count;
  });
  const rating = new Rating({
    userId: req.body.userId,
    movieId: req.body.movieId,
    rating: req.body.rating,
  });
  rating
    .save()
    .then(() => {
      updateMovie(req,res);
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
