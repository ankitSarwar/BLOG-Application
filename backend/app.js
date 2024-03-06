
import express, { Router } from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes.js';
import blogRouter from './routes/blog-routes.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); //middleware to conver data into json

app.use("/api/user",router); // http://localhost:5000/api/user

app.use("/api/blog",blogRouter);

mongoose.connect("mongodb+srv://Admin:AkgHW9v65TiHta4Z@cluster0.eyoimlb.mongodb.net/BlogApplication?retryWrites=true&w=majority&appName=Cluster0"
).then(()=> app.listen(5000))
.then(()=> 
    console.log("connected database")
)
.catch((err)=> console.log(err));


 // http://localhost:5000/api

// middeleware
// app.use("/api",(req,res,next)=>{
//     res.send("hello world")
// })

// username- Admin
// passworld - BHuCtGiZNuj99xuF

