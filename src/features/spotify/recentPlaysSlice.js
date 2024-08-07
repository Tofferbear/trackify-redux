import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recentPlays: [],
};

const recentPlaysSlice = createSlice({
  name: 'recentPlays',
  initialState,
  reducers: {
    setRecentPlays(state, action) {
      state.recentPlays = action.payload;
    },
  },
});

export const { setRecentPlays } = recentPlaysSlice.actions;

export default recentPlaysSlice.reducer;
