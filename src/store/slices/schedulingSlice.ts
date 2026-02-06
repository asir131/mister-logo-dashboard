import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type SchedulingState = {
  scheduledBlasts: any[];
  proposedSubmissions: any[];
  blastsPage: number;
  blastsTotalPages: number;
  submissionsPage: number;
  submissionsTotalPages: number;
  users: any[];
  loading: boolean;
  error: string;
};

const initialState: SchedulingState = {
  scheduledBlasts: [],
  proposedSubmissions: [],
  blastsPage: 1,
  blastsTotalPages: 1,
  submissionsPage: 1,
  submissionsTotalPages: 1,
  users: [],
  loading: true,
  error: '',
};

export const fetchScheduling = createAsyncThunk(
  'scheduling/fetch',
  async ({
    blastsPage,
    blastsLimit,
    submissionsPage,
    submissionsLimit,
  }: {
    blastsPage: number;
    blastsLimit: number;
    submissionsPage: number;
    submissionsLimit: number;
  }) => {
  const [blastsResult, submissionsResult] = await Promise.all([
    apiRequest({
      path: `/api/admin/ublasts?page=${blastsPage}&limit=${blastsLimit}`,
    }),
    apiRequest({
      path: `/api/admin/ublasts/submissions?status=pending&page=${submissionsPage}&limit=${submissionsLimit}`,
    }),
  ]);
  if (!blastsResult.ok) {
    throw new Error(blastsResult.data?.error || 'Failed to load blasts.');
  }
  const rawBlasts = blastsResult.data?.ublasts || [];
  const visibleBlasts = rawBlasts.filter((blast: any) => blast.rewardType !== 'reward');
  return {
    scheduledBlasts: visibleBlasts,
    proposedSubmissions: submissionsResult.ok ? submissionsResult.data?.submissions || [] : [],
    blastsPage: blastsResult.data?.page || blastsPage,
    blastsTotalPages: blastsResult.data?.totalPages || 1,
    submissionsPage: submissionsResult.ok ? submissionsResult.data?.page || submissionsPage : submissionsPage,
    submissionsTotalPages: submissionsResult.ok ? submissionsResult.data?.totalPages || 1 : 1,
  };
  },
);

export const fetchSchedulingUsers = createAsyncThunk('scheduling/fetchUsers', async () => {
  const result = await apiRequest({ path: '/api/admin/users?limit=200' });
  if (!result.ok) {
    throw new Error(result.data?.error || 'Failed to load users.');
  }
  return result.data?.users || [];
});

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduling.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchScheduling.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduledBlasts = action.payload.scheduledBlasts || [];
        state.proposedSubmissions = action.payload.proposedSubmissions || [];
        state.blastsPage = action.payload.blastsPage || state.blastsPage;
        state.blastsTotalPages = action.payload.blastsTotalPages || state.blastsTotalPages;
        state.submissionsPage = action.payload.submissionsPage || state.submissionsPage;
        state.submissionsTotalPages = action.payload.submissionsTotalPages || state.submissionsTotalPages;
      })
      .addCase(fetchScheduling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load blasts.';
      })
      .addCase(fetchSchedulingUsers.fulfilled, (state, action) => {
        state.users = action.payload || [];
      });
  },
});

export default schedulingSlice.reducer;
