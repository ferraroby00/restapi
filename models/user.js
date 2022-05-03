import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    seen:{
        type: Array,
        default: [] 
    }
});

export default mongoose.model('Users', UserSchema);