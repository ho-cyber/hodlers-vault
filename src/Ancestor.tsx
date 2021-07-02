import Web3 from 'web3';
import DatePicker from 'react-datepicker';
import ERC20Vault from './abis/ERC20Vault.json';
import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { getSelectedAddress, getWeb3Provider, isMetaMaskInstalled, isWalletConnected } from './utils/metaMask';
import {
  setIsChainValid,
  setIsLoadingFinished,
  setIsMetaMaskInstalled,
  selectWallet,
  setIsWalletConnected,
  setChainId
} from './slices/walletSlice';
import { useDispatch, useSelector } from 'react-redux';
import { chainIdToString, chains as supportedChains, getTokenContractAddress } from './utils/supportedChains';
import { Container } from 'semantic-ui-react';
import Registry from './contracts/Registry';

function App(props: any) {
  const wallet = useSelector(selectWallet);
  const [date, setDate] = useState(new Date());
  const [ vaults, setVaults ] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if(wallet.isWalletConnected){
      Registry.methods.getVaults().call((err: any, result: any) => console.log(err, result));
    }

    (async () => {
        dispatch(setIsMetaMaskInstalled(await isMetaMaskInstalled()));
        dispatch(setIsWalletConnected(await isWalletConnected()));
        dispatch(setIsLoadingFinished());
        
        if(wallet.isMetaMaskInstalled) {
          const provider = getWeb3Provider();

          provider.on('accountsChanged', handleAccountsChanged);
          provider.on('chainChanged', handleChainChanged);

          // TODO duplicate code
          const chainId = await provider.request({ method: 'eth_chainId' });
          handleChainChanged(chainId);
        }
    })();
  })

  

  async function transfer() {
    // Transfer fund to the vault
  }

  async function connect() {
    const provider = getWeb3Provider();
    await provider.request({ method: 'eth_requestAccounts' });
    dispatch(setIsWalletConnected(true));

    // TODO duplicate code
    const chainId = await provider.request({ method: 'eth_chainId' });
    handleChainChanged(chainId);

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
  }

  function handleChainChanged(chainId: string) {
    // If the chainId is not supported, we will display the warning
    if(supportedChains.indexOf(chainId) === -1){
      dispatch(setIsChainValid(false));
    }else{
      // Set chain ID if it is changed
      if(wallet.chainId !== chainId){
        dispatch(setChainId(chainId));
      }
      
      // Set chain validity status if it was previously invalid
      if(wallet.isValidChain === false){
        dispatch(setIsChainValid(true));
      }
    }
  }

  function handleAccountsChanged(accounts: any) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      window.location.reload();
    } 
}
  
  function renderContent() {
    return <>
      {
        wallet.chainId !== null && <p>You're on {chainIdToString(wallet.chainId as string)}</p>
      }
      {
        wallet.isValidChain === false && <p>Wrong chain. We only support Mainnet and Rinkeby</p>
      }
      {
        !wallet.isWalletConnected && <button onClick={() => connect()}>Connect</button>
      }
      
      {/* <form onSubmit={e => deploy(e)}>
        <p>Choose the Release date. Please note that you can only do this ONCE. After that, you fund won't be available until the Release date and you won't be able to change it!</p>
        <DatePicker selected={date} onChange={(value: any) => setDate(value)}/><br/>
        <button>Create Vault</button>
      </form>
       */}
    </>
  }

  return (
    <Container>
    {
      wallet.isMetaMaskInstalled ? renderContent() : <button>Please install MetaMask</button>
    }
    {
      props.children
    }
    </Container>
  );
}

export default App;
