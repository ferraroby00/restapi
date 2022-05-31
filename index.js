import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import ratingRoutes from './routes/ratings.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/movies',movieRoutes);

app.use('/users',userRoutes);

app.use('/ratings',ratingRoutes);

app.set("view engine", "ejs");

//Homepage
app.get('/home',(req,res) => {
    res.locals.user = undefined;
    res.locals.title1 = undefined;
    res.locals.title2 = undefined;
    res.render('pair-wise');
});

//Connection to database
mongoose.connect('mongodb+srv://R_Ferrareis:Tesi22__@thesis.mvjviod.mongodb.net/ufr');
const con = mongoose.connection;
con.on('open', () => {console.log('Connected to database');});
con.on('error', () => {console.log('Error');});

//Server listening on port PORT
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
