import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type UsersState = {
  filter: 'all' | 'active' | 'restricted' | 'rewarded';
  page: number;
  totalPages: number;
  users: any[];
  loading: boolean;
  error: string;
  offersSummary: {
    totalEarningsCents: number;
    statusCounts: { pending: number; paid: number; cancelled: number; expired: number };
    perUblast: any[];
  };
  offers: any[];
  rewarded: any[];
  rewardedPage: number;
  rewardedTotalPages: number;
  offersPage: number;
  offersTotalPages: number;
};

const initialState: UsersState = {
  filter: 'all',
  page: 1,
  totalPages: 1,
  users: [],
  loading: false,
  error: '',
  offersSummary: {
    totalEarningsCents: 0,
    statusCounts: { pending: 0, paid: 0, cancelled: 0, expired: 0 },
    perUblast: [],
  },
  offers: [],
  rewarded: [],
  rewardedPage: 1,
  rewardedTotalPages: 1,
  offersPage: 1,
  offersTotalPages: 1,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, filter, limit }: { page: number; filter: string; limit: number }) => {
    const result = await apiRequest({
      path: `/api/admin/users?page=${page}&limit=${limit}&filter=${filter}`,
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to load users.');
    }
    return result.data;
  },
);

export const fetchOffersSummary = createAsyncThunk('users/fetchOffersSummary', async () => {
  const result = await apiRequest({ path: '/api/admin/ublast-offers/summary' });
  if (!result.ok) {
    throw new Error(result.data?.error || 'Failed to load offers summary.');
  }
  return result.data;
});

export const fetchRewardedData = createAsyncThunk(
  'users/fetchRewardedData',
  async ({ rewardedPage, offersPage }: { rewardedPage: number; offersPage: number }) => {
    const [offersResult, rewardedResult] = await Promise.all([
      apiRequest({ path: `/api/admin/ublast-offers?page=${offersPage}&limit=10` }),
      apiRequest({ path: `/api/admin/rewarded-ublasts?page=${rewardedPage}&limit=20` }),
    ]);
    if (!offersResult.ok) {
      throw new Error(offersResult.data?.error || 'Failed to load offers.');
    }
    if (!rewardedResult.ok) {
      throw new Error(rewardedResult.data?.error || 'Failed to load rewarded ublasts.');
    }
    return {
      offers: offersResult.data?.offers || [],
      offersPage: offersResult.data?.page || offersPage,
      offersTotalPages: offersResult.data?.totalPages || 1,
      rewarded: rewardedResult.data?.rewarded || [],
      rewardedPage: rewardedResult.data?.page || rewardedPage,
      rewardedTotalPages: rewardedResult.data?.totalPages || 1,
    };
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
      state.page = 1;
      state.error = '';
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setRewardedPage(state, action) {
      state.rewardedPage = action.payload;
    },
    setOffersPage(state, action) {
      state.offersPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.users || [];
        state.page = action.payload?.page || state.page;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load users.';
      })
      .addCase(fetchOffersSummary.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.offersSummary = {
          totalEarningsCents: Number(data.totalEarningsCents || 0),
          statusCounts: data.statusCounts || {
            pending: 0,
            paid: 0,
            cancelled: 0,
            expired: 0,
          },
          perUblast: Array.isArray(data.perUblast) ? data.perUblast : [],
        };
      })
      .addCase(fetchRewardedData.fulfilled, (state, action) => {
        state.offers = action.payload.offers || [];
        state.offersPage = action.payload.offersPage || state.offersPage;
        state.offersTotalPages = action.payload.offersTotalPages || 1;
        state.rewarded = action.payload.rewarded || [];
        state.rewardedPage = action.payload.rewardedPage || state.rewardedPage;
        state.rewardedTotalPages = action.payload.rewardedTotalPages || 1;
      });
  },
});

export const { setFilter, setPage, setRewardedPage, setOffersPage } = usersSlice.actions;
export default usersSlice.reducer;
