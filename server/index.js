import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import mongoose from "mongoose";

import router from './router/index.js'
import errorMiddleware from './middlewares/error-middleware.js'
import {ServerApiVersion} from "mongodb";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverApi: ServerApiVersion.v1
            },
            () => console.log('mongo is connected'),
            (err) => {
                console.log(err)
            }
        )
        app.listen(PORT, () => console.log(`server is running on ${PORT}`))
    } catch (err) {
        console.error(err);
    }
}

start();
