import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type OverviewState = {
  stats: {
    totalUsers: number;
    totalUposts: number;
    totalUblasts: number;
    totalUblastShares: number;
    totalActiveUsers: number;
    ublastSharePercent: number;
    ublastSharedCount: number;
    ublastShareTarget: number;
  };
  growthData: Array<{ name: string; users: number }>;
  platformData: Array<{ name: string; shares: number }>;
  trendingHashtags: Array<{ tag: string; count: number }>;
  loading: boolean;
  error: string;
};

const initialState: OverviewState = {
  stats: {
    totalUsers: 0,
    totalUposts: 0,
    totalUblasts: 0,
    totalUblastShares: 0,
    totalActiveUsers: 0,
    ublastSharePercent: 0,
    ublastSharedCount: 0,
    ublastShareTarget: 0,
  },
  growthData: [],
  platformData: [],
  trendingHashtags: [],
  loading: true,
  error: '',
};

export const fetchOverview = createAsyncThunk('overview/fetch', async () => {
  const result = await apiRequest({ path: '/api/admin/stats' });
  if (!result.ok) {
    throw new Error(result.data?.error || 'Failed to load stats.');
  }
  return result.data;
});

const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.stats = {
          totalUsers: Number(data.totalUsers || 0),
          totalUposts: Number(data.totalUposts || 0),
          totalUblasts: Number(data.totalUblasts || 0),
          totalUblastShares: Number(data.totalUblastShares || 0),
          totalActiveUsers: Number(data.totalActiveUsers || 0),
          ublastSharePercent: Number(data.ublastSharePercent || 0),
          ublastSharedCount: Number(data.ublastSharedCount || 0),
          ublastShareTarget: Number(data.ublastShareTarget || 0),
        };
        state.growthData = Array.isArray(data.growthData) ? data.growthData : [];
        state.platformData = Array.isArray(data.platformData) ? data.platformData : [];
        state.trendingHashtags = Array.isArray(data.trendingHashtags)
          ? data.trendingHashtags
          : [];
        state.loading = false;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load stats.';
      });
  },
});

export default overviewSlice.reducer;
