import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type SubmissionsState = {
  submissions: any[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string;
};

const initialState: SubmissionsState = {
  submissions: [],
  page: 1,
  totalPages: 1,
  loading: true,
  error: '',
};

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetch',
  async ({ status, page, limit }: { status: string; page: number; limit: number }) => {
    const statusParam = status ? `?status=${status}` : '?';
    const result = await apiRequest({
      path: `/api/admin/ublasts/submissions${statusParam}&page=${page}&limit=${limit}`,
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to load submissions.');
    }
    return result.data;
  },
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload?.submissions || [];
        state.page = action.payload?.page || state.page;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load submissions.';
      });
  },
});

export default submissionsSlice.reducer;
