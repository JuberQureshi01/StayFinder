
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const initialState = {
    itinerary: null,
    description: null,
    loading: false,
    error: null,
};

// generating an itinerary
export const generateItinerary = createAsyncThunk(
    'ai/generateItinerary',
    async (itineraryData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/ai/generate-itinerary', itineraryData);
            toast.success('Itinerary generated successfully!');
            return response.data.data.itinerary;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate itinerary.');
            return rejectWithValue(error.response?.data);
        }
    }
);

//  generating a property description
export const generateDescription = createAsyncThunk(
    'ai/generateDescription',
    async (descriptionData, { rejectWithValue }) => {
        try {
            console.log(descriptionData)
            const response = await axiosInstance.post('/ai/generate-description', descriptionData);
            toast.success('Description generated successfully!');
            return response.data.data.description;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate description.');
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


const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearItinerary: (state) => {
            state.itinerary = null;
        },
        clearDescription: (state) => {
            state.description = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateItinerary.pending, (state) => {
                state.loading = true;
                state.itinerary = null;
                state.error = null;
            })
            .addCase(generateItinerary.fulfilled, (state, action) => {
                state.loading = false;
                state.itinerary = action.payload;
            })
            .addCase(generateItinerary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(generateDescription.pending, (state) => {
                state.loading = true;
                state.description = null;
                state.error = null;
            })
            .addCase(generateDescription.fulfilled, (state, action) => {
                state.loading = false;
                state.description = action.payload;
            })
            .addCase(generateDescription.rejected, (state, action) => {
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

export const { clearItinerary, clearDescription } = aiSlice.actions;
export default aiSlice.reducer;