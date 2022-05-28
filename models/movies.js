import mongoose from "mongoose";

const MovieSchema = mongoose.Schema({
  movieID: {
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
});

export default mongoose.model("Movies", MovieSchema);
