import mongoose from "mongoose";

const FilmSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Films", FilmSchema);
