import Rating from "../models/rating.js";
import mongoose from "mongoose";

//GET HANDLER - Returns all movies documents
export const getAll = (req, res) => {
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

//POST HANDLER - Inserts a new rating document
export const insertRating = (req, res) => {
  const rating = new Rating({
    ratedBy: mongoose.Types.ObjectId(req.body.ratedBy),
    filmId: mongoose.Types.ObjectId(req.body.filmId),
    rating: req.body.rating,
  });
  rating
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

//GET BY ID HANDLER - Returns a rating by film ID
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

//DELETE BY ID HANDLER - Deletes a rating by ID
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

//PATCH BY ID HANDLER - Updates a movie by ID and by specific fields stored in HTTP request body
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
