import mongoose from "mongoose";

const MovieSchema = mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
  popularity_index: {
    type: Number,
  },
});

export default mongoose.model("Movie", MovieSchema);
