import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type TrendingControlState = {
  overview: any;
  officialBlasts: any[];
  submissions: any[];
  meta: {
    top: { page: number; totalPages: number };
    manual: { page: number; totalPages: number };
    organic: { page: number; totalPages: number };
  };
  loading: boolean;
  error: string;
};

const initialState: TrendingControlState = {
  overview: null,
  officialBlasts: [],
  submissions: [],
  meta: {
    top: { page: 1, totalPages: 1 },
    manual: { page: 1, totalPages: 1 },
    organic: { page: 1, totalPages: 1 },
  },
  loading: true,
  error: '',
};

export const fetchTrendingControl = createAsyncThunk(
  'trendingControl/fetch',
  async ({
    topPage,
    manualPage,
    organicPage,
  }: {
    topPage: number;
    manualPage: number;
    organicPage: number;
  }) => {
  const [overviewResult, ublastsResult, submissionsResult] = await Promise.all([
    apiRequest({
      path: `/api/admin/trending/overview?topPage=${topPage}&manualPage=${manualPage}&organicPage=${organicPage}`,
    }),
    apiRequest({ path: '/api/admin/ublasts?limit=200' }),
    apiRequest({ path: '/api/admin/ublasts/submissions?status=approved&limit=200' }),
  ]);
  if (!overviewResult.ok) {
    throw new Error(overviewResult.data?.error || 'Failed to load trending overview.');
  }
  return {
    overview: overviewResult.data,
    officialBlasts: ublastsResult.ok ? ublastsResult.data?.ublasts || [] : [],
    submissions: submissionsResult.ok ? submissionsResult.data?.submissions || [] : [],
    meta: overviewResult.data?.meta || null,
  };
  },
);

const trendingControlSlice = createSlice({
  name: 'trendingControl',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingControl.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTrendingControl.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.overview;
        state.officialBlasts = action.payload.officialBlasts;
        state.submissions = action.payload.submissions;
        if (action.payload.meta) {
          state.meta = {
            top: action.payload.meta.top || state.meta.top,
            manual: action.payload.meta.manual || state.meta.manual,
            organic: action.payload.meta.organic || state.meta.organic,
          };
        }
      })
      .addCase(fetchTrendingControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load trending.';
      });
  },
});

export default trendingControlSlice.reducer;
