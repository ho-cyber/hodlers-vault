import { useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { getWeb3Provider, isMetaMaskInstalled, isWalletConnected } from '../utils/metaMask';
import {
  setIsChainValid,
  setIsLoadingFinished,
  setIsMetaMaskInstalled,
  selectWallet,
  setIsWalletConnected,
  setChainId
} from '../slices/walletSlice';
import { useDispatch, useSelector } from 'react-redux';
import { chainIdToString, chains as supportedChains } from '../utils/supportedChains';
import { Button, Container, Message } from 'semantic-ui-react';

function App(props: any) {
  const wallet = useSelector(selectWallet);

  const dispatch = useDispatch();

  useEffect(() => {
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

  async function connect() {
    const provider = getWeb3Provider();
    await provider.request({ method: 'eth_requestAccounts' });
    dispatch(setIsWalletConnected(true));

    // TODO duplicate code
    const chainId = await provider.request({ method: 'eth_chainId' });
    handleChainChanged(chainId);

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    
    window.location.reload();
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
  
  return (
    <Container style={{marginTop: 10}}>
      <div>
        {
          wallet.chainId !== null && <p style={{textAlign: 'center'}}>You're on {chainIdToString(wallet.chainId as string)}</p>
        }
        {
          wallet.isValidChain === false && <p style={{textAlign: 'center'}}>Wrong chain. We only support Rinkeby. Please switch to Rinkeby and refresh the page.</p>
        }
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {
          wallet.isMetaMaskInstalled ? !wallet.isWalletConnected && <Button onClick={() => connect()}>Connect</Button> : <Message error>MetaMask is not installed. Please install MetaMask.</Message>
        }
        </div>
       
        {
          props.children
        }
      </div>
    </Container>
  );
}

export default App;
