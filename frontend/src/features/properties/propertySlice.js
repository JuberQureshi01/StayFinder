import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const initialState = {
    properties: [],
    myProperties: [], 
    property: null,
        searchResults: [], 
    isSearchActive: false, 
     coordinates: null,
    loading: false,
    error: null,
};

export const fetchProperties = createAsyncThunk(
    'properties/fetchProperties',
    async (category = 'Trending', { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/properties?category=${category}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);
export const searchProperties = createAsyncThunk(
    'properties/searchProperties',
    async (location, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/properties?location=${location}`);
            return response.data.data;
        } catch (error) {
            toast.error("Search failed. Please try again.");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchPropertyById = createAsyncThunk(
    'properties/fetchPropertyById',
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/properties/${propertyId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch property details');
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchMyProperties = createAsyncThunk(
    'properties/fetchMyProperties',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/properties/my-properties');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);
export const updateProperty = createAsyncThunk(
    'properties/updateProperty',
    async ({ propertyId, propertyData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/properties/${propertyId}`, propertyData);
            toast.success("Listing updated successfully!");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update listing.");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const createProperty = createAsyncThunk(
    'properties/createProperty',
    async (propertyData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/properties', propertyData);
            toast.success("Listing created successfully!");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create listing.");
            return rejectWithValue(error.response?.data);
        }
    }
);
export const fetchPropertyCoordinates = createAsyncThunk(
    'properties/fetchCoordinates',
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/properties/${propertyId}/coordinates`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteProperty = createAsyncThunk(
    'properties/deleteProperty',
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/properties/${propertyId}`);
            toast.success("Listing deleted successfully!");
            return response.data.data.deletedPropertyId;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete listing.");
            return rejectWithValue(error.response?.data);
        }
    }
);


const propertySlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        clearCoordinates: (state) => {
            state.coordinates = null;
        },
        clearProperty: (state) => {
            state.property = null;
        },
         clearSearch: (state) => {
            state.searchResults = [];
            state.isSearchActive = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Cases for fetching all properties
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cases for fetching a single property
            .addCase(fetchPropertyById.pending, (state) => {
                state.loading = true;
                state.property = null;
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                state.property = action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cases for fetching host's properties
            .addCase(fetchMyProperties.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.myProperties = action.payload;
            })
            .addCase(fetchMyProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cases for creating a property
            .addCase(createProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.myProperties.push(action.payload);
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }) 
            //for mapbox coordination
            .addCase(fetchPropertyCoordinates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyCoordinates.fulfilled, (state, action) => {
                state.loading = false;
                state.coordinates = action.payload;
            })
            .addCase(fetchPropertyCoordinates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             // Update the property 
             .addCase(updateProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.loading = false;
               
                const index = state.myProperties.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.myProperties[index] = action.payload;
                }
            })
            .addCase(updateProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //delete the property 
            .addCase(deleteProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.myProperties = state.myProperties.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //search the property 
            .addCase(searchProperties.pending, (state) => {
                state.loading = true;
                state.isSearchActive = true;
            })
            .addCase(searchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCoordinates,clearProperty,clearSearch } = propertySlice.actions;
export default propertySlice.reducer;