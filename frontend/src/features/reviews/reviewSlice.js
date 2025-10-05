import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';


const initialState = {
    reviews: [],
    loading: false,
    error: null,
};


export const fetchReviewsByPropertyId = createAsyncThunk(
    'reviews/fetchByPropertyId',
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/properties/${propertyId}/reviews`);
            return response.data.data;
        } catch (error) {
            toast.error('Could not fetch reviews.');
            return rejectWithValue(error.response?.data);
        }
    }
);


export const createReview = createAsyncThunk(
    'reviews/createReview',
    async ({ propertyId, rating, comment }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/properties/${propertyId}/reviews`, { rating, comment });
            toast.success(response.data.message || "Review submitted successfully.");
            dispatch(fetchReviewsByPropertyId(propertyId));
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
            return rejectWithValue(error.response?.data);
        }
    }
);
export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async ({ propertyId, reviewId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/properties/${propertyId}/reviews/${reviewId}`);
            toast.success("Review deleted successfully!");
            return response.data.data.deletedReviewId;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete review.");
            return rejectWithValue(error.response?.data);
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewsByPropertyId.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReviewsByPropertyId.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviewsByPropertyId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(createReview.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter(r => r._id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default reviewSlice.reducer;