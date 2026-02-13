import ProfilesService from '@/services/ProfilesService';
import { IUser } from '@/types/profiles';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// thunk
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user: IUser = await ProfilesService.getOwnProfile();
      return user;
    } catch {
      return rejectWithValue('Unauthorized');
    }
  },
);

interface IinitialState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: IinitialState = {
  user: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfile: (state, action: PayloadAction<IUser>) => {
      state.user = { ...action.payload };
    },
    logOut: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export const { getProfile, logOut } = profileSlice.actions;
export default profileSlice.reducer;
