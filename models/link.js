import mongoose from "mongoose";

const LinkSchema = mongoose.Schema({
  movieId: {
    type: String,
    required: true
  },
  imdbId: {
    type: String,
    required: true
  },
  tmdbId: {
    type: String,
    required: true
  }
});

export default mongoose.model("Link", LinkSchema);
