import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import filmRoutes from './routes/films.js';
import userRoutes from './routes/users.js';
import ratingRoutes from './routes/ratings.js';
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/films',filmRoutes);

app.use('/users',userRoutes);

app.use('/ratings',ratingRoutes);
//Homepage
app.get('/',(req,res) => {
    res.send('Hello from Homepage');
});

mongoose.connect('mongodb://127.0.0.1:27017/ufr');
const con = mongoose.connection;
con.on('open', () => {console.log('Connected to DB');});
con.on('error', () => {console.log('Error');});
//Ascolto sulla porta PORT
app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`));
