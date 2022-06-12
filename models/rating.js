import mongoose from "mongoose";

const RatingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  }
});

export default mongoose.model("Ratings", RatingSchema);
