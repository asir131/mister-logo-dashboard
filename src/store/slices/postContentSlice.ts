import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type PostContentState = {
  userPosts: any[];
  officialPosts: any[];
  userPage: number;
  userTotalPages: number;
  officialPage: number;
  officialTotalPages: number;
  loading: boolean;
  error: string;
};

const initialState: PostContentState = {
  userPosts: [],
  officialPosts: [],
  userPage: 1,
  userTotalPages: 1,
  officialPage: 1,
  officialTotalPages: 1,
  loading: false,
  error: '',
};

export const fetchUserPosts = createAsyncThunk(
  'postContent/fetchUserPosts',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await apiRequest({
      path: `/api/admin/posts?page=${page}&limit=${limit}`,
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to load posts.');
    }
    return result.data;
  },
);

export const fetchOfficialPosts = createAsyncThunk(
  'postContent/fetchOfficialPosts',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await apiRequest({
      path: `/api/admin/official-posts?page=${page}&limit=${limit}`,
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to load official posts.');
    }
    return result.data;
  },
);

const postContentSlice = createSlice({
  name: 'postContent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload?.posts || [];
        state.userPage = action.payload?.page || state.userPage;
        state.userTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load posts.';
      })
      .addCase(fetchOfficialPosts.fulfilled, (state, action) => {
        state.officialPosts = action.payload?.ublasts || [];
        state.officialPage = action.payload?.page || state.officialPage;
        state.officialTotalPages = action.payload?.totalPages || 1;
      });
  },
});

export default postContentSlice.reducer;
