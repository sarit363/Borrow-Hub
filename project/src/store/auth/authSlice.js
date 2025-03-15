import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload;
    },
    logout: (state) => {
      state.userId = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
