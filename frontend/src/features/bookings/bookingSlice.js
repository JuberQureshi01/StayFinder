import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const initialState = {
    userBookings: [], 
    currentBooking: null,
    loading: false,
    error: null,
};


export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/bookings', bookingData);
            toast.success(response.data.message);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchUserBookings = createAsyncThunk(
    'bookings/fetchUserBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/bookings/my-bookings');
            return response.data.data;
        } catch (error) {
            toast.error("Failed to fetch your bookings.");
            return rejectWithValue(error.response?.data);
        }
    }
);


const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.userBookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bookingSlice.reducer;