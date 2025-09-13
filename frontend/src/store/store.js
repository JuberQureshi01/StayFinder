
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import propertyReducer from '../features/properties/propertySlice';
import bookingReducer from '../features/bookings/bookingSlice';
import aiReducer from '../features/ai/aiSlice';
import userReducer from '../features/users/userSlice';
import reviewReducer from '../features/reviews/reviewSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    bookings: bookingReducer,
    ai: aiReducer,
    user: userReducer,
    reviews: reviewReducer, 
  },
});