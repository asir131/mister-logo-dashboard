import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type ModerationState = {
  users: any[];
  usersPage: number;
  usersTotalPages: number;
  posts: any[];
  postsPage: number;
  postsTotalPages: number;
  loadingUsers: boolean;
  loadingPosts: boolean;
  errorUsers: string;
  errorPosts: string;
};

const initialState: ModerationState = {
  users: [],
  usersPage: 1,
  usersTotalPages: 1,
  posts: [],
  postsPage: 1,
  postsTotalPages: 1,
  loadingUsers: false,
  loadingPosts: false,
  errorUsers: '',
  errorPosts: '',
};

export const fetchModerationUsers = createAsyncThunk(
  'moderation/fetchUsers',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await apiRequest({
      path: `/api/admin/users?page=${page}&limit=${limit}`,
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to load users.');
    }
    return result.data;
  },
);

export const fetchModerationPosts = createAsyncThunk(
  'moderation/fetchPosts',
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

export const restrictUser = createAsyncThunk(
  'moderation/restrictUser',
  async ({ userId }: { userId: string }) => {
    const result = await apiRequest({
      path: `/api/admin/users/${userId}/restrict`,
      method: 'PATCH',
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to update user.');
    }
    return { userId, data: result.data };
  },
);

export const unrestrictUser = createAsyncThunk(
  'moderation/unrestrictUser',
  async ({ userId }: { userId: string }) => {
    const result = await apiRequest({
      path: `/api/admin/users/${userId}/unrestrict`,
      method: 'PATCH',
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to update user.');
    }
    return { userId, data: result.data };
  },
);

const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModerationUsers.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = '';
      })
      .addCase(fetchModerationUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload?.users || [];
        state.usersPage = action.payload?.page || state.usersPage;
        state.usersTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchModerationUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.error.message || 'Failed to load users.';
      })
      .addCase(fetchModerationPosts.pending, (state) => {
        state.loadingPosts = true;
        state.errorPosts = '';
      })
      .addCase(fetchModerationPosts.fulfilled, (state, action) => {
        state.loadingPosts = false;
        state.posts = action.payload?.posts || [];
        state.postsPage = action.payload?.page || state.postsPage;
        state.postsTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchModerationPosts.rejected, (state, action) => {
        state.loadingPosts = false;
        state.errorPosts = action.error.message || 'Failed to load posts.';
      })
      .addCase(restrictUser.fulfilled, (state, action) => {
        const { userId, data } = action.payload;
        state.users = state.users.map((user: any) =>
          user.id === userId
            ? {
                ...user,
                status: data.status || user.status,
                ublastBlocked:
                  typeof data.ublastBlocked === 'boolean' ? data.ublastBlocked : user.ublastBlocked,
                ublastBlockedUntil: data.ublastBlockedUntil ?? user.ublastBlockedUntil,
              }
            : user,
        );
      })
      .addCase(unrestrictUser.fulfilled, (state, action) => {
        const { userId, data } = action.payload;
        state.users = state.users.map((user: any) =>
          user.id === userId
            ? {
                ...user,
                status: data.status || user.status,
                ublastBlocked:
                  typeof data.ublastBlocked === 'boolean' ? data.ublastBlocked : user.ublastBlocked,
                ublastBlockedUntil: data.ublastBlockedUntil ?? user.ublastBlockedUntil,
              }
            : user,
        );
      });
  },
});

export default moderationSlice.reducer;
