import mongoose from "mongoose";
import Rating from "../models/rating.js";
import Movie from "../models/movie.js";

//GET HANDLER - returns all movies documents
export const getAllRatings = (req, res) => {
  Rating.aggregate([
    { $match: { rating: { $exists: true } } },
    { $group: { _id: "$filmId" } },
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
        movieName: { $arrayElemAt: ["$join.title", 0] },
      },
    },
    {
      $project: {
        movieName: 1,
      },
    },
  ])
    .then(function (el) {
      res.send(el);
    })
    .catch(() => {
      res.json({ message: "Cannot get ratings" });
    });
};

//POST HANDLER - inserts a new rating document and updates movie popularity_index
export const insertRating = (req, res) => {
  let max;
  Movie.findOne({ title: req.body.movieTitle })
    .then((rs) => {
      const rating = new Rating({
        userId: req.body.userId,
        movieId: rs.movieId,
        rating: req.body.movieRating,
      });
      return rating.save();
    })
    .then((rs) => {
      return Rating.countDocuments({});
    })
    .then((rs) => {
      max = rs;
      return Rating.aggregate([
        { $group: { _id: "$movieId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
    })
    .then((rs) => {
      rs.forEach((el) => {
        el.count = el.count / max;
      });
      rs.forEach((el) => {
        Movie.updateOne(
          { movieId: el._id },
          { $set: { prob_index: el.count } },
          () => {}
        );
      });
    })
    .catch(() => {
      res.json({ message: "Cannot add rating" });
    });
  res.redirect("/users/" + req.body.uname);
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
      res.send(`Rating id: ${id} deleted from database`);
    })
    .catch(() => {
      res.json({ message: "Cannot delete rating" });
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
      .catch(() => {
        res.json({ message: "Cannot update rating" });
      });
};