export async function isMetaMaskInstalled()  {
    return await getWeb3ProviderOrNull() !== null;
}

export async function isWalletConnected() {
    try {
        await getSelectedAddress();
        return true;
    }catch(e){
        return false;
    }
}

export function getWeb3Provider() {
    let provider = getWeb3ProviderOrNull();
    if(!provider){
        throw new Error('No provider');
    }
    return provider;
}

export function getWeb3ProviderOrNull() {
    if( typeof((window as any).ethereum) !== "undefined"){
        return (window as any).ethereum;
    }
    return null;
}

export async function getSelectedAddress(){
    const provider = getWeb3Provider();
    const accounts = await provider.request({ method: 'eth_accounts' });
    if(accounts.length === 0){
        throw new Error('Found no account');
    }
    return accounts[0];
}