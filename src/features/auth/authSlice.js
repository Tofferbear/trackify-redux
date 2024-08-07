import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authorizationCode: '',
  isAuthorized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthorizationCode: (state, action) => {
      state.authorizationCode = action.payload;
      state.isAuthorized = true;
    },
  },
});

export const { setAuthorizationCode } = authSlice.actions;

export const selectAuthorizationCode = (state) => state.auth.authorizationCode;

export default authSlice.reducer;
