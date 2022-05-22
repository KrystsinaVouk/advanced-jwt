import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from './router/index.js'

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(`/api`, router);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`server is running on ${PORT}`))
    } catch (err) {
        console.error(err);
    }
}

start();
