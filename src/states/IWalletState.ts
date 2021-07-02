export default interface IWalletState {
    isLoading: boolean,
    isMetaMaskInstalled: boolean,
    isWalletConnected: boolean,
    isValidChain?: boolean,
    chainId?: string,
}
