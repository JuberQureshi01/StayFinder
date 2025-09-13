
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

const initialState = {
    profile: null,
    loading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk(
    'users/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/users/me');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'users/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch('/users/profile', profileData);
            toast.success('Profile updated successfully!');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
            return rejectWithValue(error.response?.data);
        }
    }
);
export const updateUserAvatar = createAsyncThunk(
    'users/updateAvatar',
    async (avatarFile, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        try {
            const response = await axiosInstance.patch('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Profile picture updated!");
            return response.data.data;
        } catch (error) {
            toast.error("Failed to update profile picture.");
            return rejectWithValue(error.response?.data);
        }
    }
);


const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                if (state.profile) {
                    state.profile.profilePictureUrl = action.payload.profile.profilePictureUrl;
                }
            });
    },
});

export default userSlice.reducer;