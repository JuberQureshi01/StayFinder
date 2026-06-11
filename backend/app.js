
import dotenv from 'dotenv';
import connectDB from './config/connectDb.js';
import { connectRedis } from './config/connectredis.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import bookingRouter from './routes/booking.routes.js';
import reviewRouter from './routes/review.routes.js';
import aiRouter from './routes/ai.routes.js';

const app = express();
dotenv.config({
    path: '.env'
});

const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ["http://localhost:5173"];

app.use(helmet());
app.use(compression());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan(isProduction ? 'combined' : 'dev'));

connectDB()
    .then(() => {
        connectRedis();
    })
    .catch((err) => {
        console.error("MongoDB connection failed! Server is not running.", err);
    });

app.use(express.static('public'));

app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/ai", aiRouter);
propertyRouter.use('/:propertyId/reviews', reviewRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = isProduction && statusCode === 500 ? 'Internal server error' : (err.message || 'Internal server error');
    if (statusCode === 500) console.error('Server Error:', err);
    res.status(statusCode).json({ success: false, message });
});

app.listen(PORT, () => {
    console.log(` Server is running at http://localhost:${PORT}`);
});
