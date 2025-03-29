import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    username: '',
    isAdmin: false,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.isAdmin = action.payload.isAdmin || false; 
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.username = '';
      state.isAdmin = false;
      state.isAuthenticated = false;
    },
  },
});


export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;