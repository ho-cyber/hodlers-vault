import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import pageReducer from './slices/pageSlice';

export default configureStore({
  reducer: {
    wallet: walletReducer,
    page: pageReducer
  },
});
