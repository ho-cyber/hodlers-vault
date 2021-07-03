import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'page',
  initialState: {
    currentPage: "home"
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
});

export const { setCurrentPage } = slice.actions;

export const selectPage = (state: any) => state.page ;

export default slice.reducer;
