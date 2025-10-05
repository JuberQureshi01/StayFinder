
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const initialState = {
    itinerary: null,
    description: null,
    loading: false,
    error: null,
};

export const generateItinerary = createAsyncThunk(
    'ai/generateItinerary',
    async (itineraryData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/ai/generate-itinerary', itineraryData);
            toast.success('Itinerary generated successfully!');
            console.log(response)
            return response.data.data.itinerary;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate itinerary.');
            return rejectWithValue(error.response?.data);
        }
    }
);

export const generateDescription = createAsyncThunk(
    'ai/generateDescription',
    async (descriptionData, { rejectWithValue }) => {
        try {
            console.log(descriptionData)
            const response = await axiosInstance.post('/ai/generate-description', descriptionData);
            toast.success('Description generated successfully!');
            console.log(response)
            return response.data.data.description;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate description.');
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
    },
});

export const { clearItinerary, clearDescription } = aiSlice.actions;
export default aiSlice.reducer;