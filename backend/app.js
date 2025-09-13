
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './features/users/user.routes.js';
import propertyRouter from './features/properties/property.routes.js';
import bookingRouter from './features/bookings/booking.routes.js';
import reviewRouter from './features/reviews/review.routes.js';
import aiRouter from './features/ai/ai.routes.js';

const app = express();
dotenv.config({
    path: '.env'
});

const PORT = 8000 || process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

connectDB()
    .then(() => {
        connectRedis();
    })
    .catch((err) => {
        console.error("MongoDB connection failed! Server is not running.", err);
    });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/ai", aiRouter);
propertyRouter.use('/:propertyId/reviews', reviewRouter);



app.listen(PORT, () => {
    console.log(` Server is running at http://localhost:${PORT}`);
});