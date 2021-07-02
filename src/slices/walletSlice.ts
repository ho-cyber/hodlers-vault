import { createSlice } from '@reduxjs/toolkit';
import IWalletState from '../states/IWalletState';

export const slice = createSlice({
  name: 'wallet',
  initialState: {
    isLoading: true,
    isMetaMaskInstalled: false,
    isWalletConnected: false,
  },
  reducers: {
    metaMaskInstalled: (state, action) => {
      state.isMetaMaskInstalled = action.payload as boolean;
    },
    walletConnected: (state, action) => {
      state.isWalletConnected = action.payload as boolean;
    },
    loadingFinished: (state) => {
      state.isLoading = false;
    }
  },
});

export const { metaMaskInstalled, walletConnected, loadingFinished } = slice.actions;

export const selectWallet = (state: { wallet: IWalletState; }) => state.wallet as IWalletState;

export default slice.reducer;
