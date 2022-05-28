import mongoose from "mongoose";

const CounterSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    seqNumber: {
      type: Number,
      required: true,
    },
  });
  
  export default mongoose.model("Counters", CounterSchema);