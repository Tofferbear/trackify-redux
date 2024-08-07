import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import historicPlaysReducer from '../features/spotify/historicPlaysSlice';
import recentPlaysReducer from '../features/spotify/recentPlaysSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    historicPlays: historicPlaysReducer,
    recentPlays: recentPlaysReducer
  },
  devTools: process.env.NODE_ENV !== 'production' // Enable Redux DevTools only in development
});
