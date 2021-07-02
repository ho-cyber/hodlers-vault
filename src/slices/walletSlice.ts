import { createSlice } from '@reduxjs/toolkit';
import IWalletState from '../states/IWalletState';

export const slice = createSlice({
  name: 'wallet',
  initialState: {
    isLoading: true,
    isMetaMaskInstalled: false,
    isWalletConnected: false,
    isValidChain: null,
    chainId: null,
  },
  reducers: {
    setIsMetaMaskInstalled: (state, action) => {
      state.isMetaMaskInstalled = action.payload as boolean;
    },
    setIsWalletConnected: (state, action) => {
      state.isWalletConnected = action.payload as boolean;
    },
    setIsChainValid: (state, action) => {
      state.isValidChain = action.payload;
      if(action.payload !== true){
        state.chainId = null;
      }
    },
    setChainId: (state, action) => {
      state.chainId= action.payload;
    },
    setIsLoadingFinished: (state) => {
      state.isLoading = false;
    }
  },
});

export const { setIsMetaMaskInstalled, setIsWalletConnected, setIsLoadingFinished, setIsChainValid, setChainId } = slice.actions;

export const selectWallet = (state: { wallet: IWalletState; }) => state.wallet as IWalletState;

export default slice.reducer;
