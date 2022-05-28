import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const RatingSchema = mongoose.Schema({
  ratedBy: {
    type: ObjectId,
    required: true,
  },
  filmId: {
    type: ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Ratings", RatingSchema);
