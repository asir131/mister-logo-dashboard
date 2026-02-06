import { configureStore } from '@reduxjs/toolkit';
import overviewReducer from './slices/overviewSlice';
import usersReducer from './slices/usersSlice';
import schedulingReducer from './slices/schedulingSlice';
import trendingControlReducer from './slices/trendingControlSlice';
import submissionsReducer from './slices/submissionsSlice';
import postContentReducer from './slices/postContentSlice';
import moderationReducer from './slices/moderationSlice';

export const store = configureStore({
  reducer: {
    overview: overviewReducer,
    users: usersReducer,
    scheduling: schedulingReducer,
    trendingControl: trendingControlReducer,
    submissions: submissionsReducer,
    postContent: postContentReducer,
    moderation: moderationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
