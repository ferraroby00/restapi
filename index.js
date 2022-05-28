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
app.get('/home',(req,res) => {
    res.send('Welcome to the homepage');
});

//Connection to database
mongoose.connect('mongodb+srv://R_Ferrareis:Tesi22__@thesis.mvjviod.mongodb.net/ufr');
const con = mongoose.connection;
con.on('open', () => {console.log('Connected to database');});
con.on('error', () => {console.log('Error');});

//Server listening on port PORT
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
