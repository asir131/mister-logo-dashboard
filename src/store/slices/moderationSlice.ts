import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/apiClient';

type ModerationState = {
  users: any[];
  usersPage: number;
  usersTotalPages: number;
  posts: any[];
  postsPage: number;
  postsTotalPages: number;
  actions: any[];
  actionsPage: number;
  actionsTotalPages: number;
  selectedUserIds: string[];
  loadingUsers: boolean;
  loadingPosts: boolean;
  loadingActions: boolean;
  errorUsers: string;
  errorPosts: string;
  errorActions: string;
};

const initialState: ModerationState = {
  users: [],
  usersPage: 1,
  usersTotalPages: 1,
  posts: [],
  postsPage: 1,
  postsTotalPages: 1,
  actions: [],
  actionsPage: 1,
  actionsTotalPages: 1,
  selectedUserIds: [],
  loadingUsers: false,
  loadingPosts: false,
  loadingActions: false,
  errorUsers: '',
  errorPosts: '',
  errorActions: '',
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

export const fetchModerationActions = createAsyncThunk(
  'moderation/fetchActions',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await apiRequest({
      path: `/api/admin/moderation/actions?page=${page}&limit=${limit}`,
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to load actions.');
    }
    return result.data;
  },
);

export const deletePost = createAsyncThunk(
  'moderation/deletePost',
  async ({ postId }: { postId: string }) => {
    const result = await apiRequest({
      path: `/api/admin/posts/${postId}`,
      method: 'DELETE',
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to delete post.');
    }
    return { postId };
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

export const deleteUsersBulk = createAsyncThunk(
  'moderation/deleteUsersBulk',
  async ({ userIds }: { userIds: string[] }) => {
    const result = await apiRequest({
      path: `/api/admin/users/delete`,
      method: 'POST',
      body: { userIds },
    });
    if (!result.ok) {
      throw new Error(result.data?.error || 'Failed to delete users.');
    }
    return { userIds };
  },
);

const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    toggleSelectedUser(state, action) {
      const userId = action.payload;
      if (state.selectedUserIds.includes(userId)) {
        state.selectedUserIds = state.selectedUserIds.filter((id) => id !== userId);
      } else {
        state.selectedUserIds.push(userId);
      }
    },
    setSelectedUsers(state, action) {
      state.selectedUserIds = action.payload || [];
    },
    clearSelectedUsers(state) {
      state.selectedUserIds = [];
    },
  },
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
      .addCase(fetchModerationActions.pending, (state) => {
        state.loadingActions = true;
        state.errorActions = '';
      })
      .addCase(fetchModerationActions.fulfilled, (state, action) => {
        state.loadingActions = false;
        state.actions = action.payload?.actions || [];
        state.actionsPage = action.payload?.page || state.actionsPage;
        state.actionsTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchModerationActions.rejected, (state, action) => {
        state.loadingActions = false;
        state.errorActions = action.error.message || 'Failed to load actions.';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        state.posts = state.posts.filter((post: any) => post.id !== postId);
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
      })
      .addCase(deleteUsersBulk.fulfilled, (state, action) => {
        const ids = action.payload.userIds || [];
        state.users = state.users.filter((user: any) => !ids.includes(user.id));
        state.selectedUserIds = [];
      });
  },
});

export const { toggleSelectedUser, setSelectedUsers, clearSelectedUsers } = moderationSlice.actions;
export default moderationSlice.reducer;
