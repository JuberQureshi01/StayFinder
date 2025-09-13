import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbConnected = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(` MongoDB connected `);
        return dbConnected;
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;