import Web3 from 'web3';
import DatePicker from 'react-datepicker';
import ERC20Vault from './contracts/ERC20Vault.json';
import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { getSelectedAddress, getWeb3Provider, isMetaMaskInstalled, isWalletConnected } from './utils/metaMask';
import {
  loadingFinished,
  metaMaskInstalled,
  selectWallet,
  walletConnected
} from './slices/walletSlice';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const wallet = useSelector(selectWallet);
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();

  useEffect(() => {
    // Use this technique to ensure that we don't query MetaMask everytime the component states are updated
    let mounted = true;

    (async () => {
        if(!mounted){
            return;
        }
        dispatch(metaMaskInstalled(await isMetaMaskInstalled()));
        dispatch(walletConnected(await isWalletConnected()));
        dispatch(loadingFinished());
        
        if(wallet.isMetaMaskInstalled) {
          const provider = getWeb3Provider();
          
          provider.on('accountsChanged', handleAccountsChanged);
          provider.on('chainChanged', handleChainChanged);
        }
    })();

    return function cleanup() {
        mounted = false;
    }
})

  async function deploy(e: any) {
    e.preventDefault();
    console.log(date.getTime() / 1000);

    const web3 = new Web3(Web3.givenProvider);
    const accounts = await web3.eth.getAccounts();

    const contract = new web3.eth.Contract(ERC20Vault.abi as any);

    console.log(accounts);
    console.log(contract);

    // contract.deploy({
    //   data: ERC20Vault.bytecode,
    //   arguments: [ "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", 0]
    // })
    // .send({
    //   from: accounts[0]
    // })
    // .then(inst => setVaultContract(inst.options.address));
  }

  async function transfer() {
    // Transfer fund to the vault
  }

  async function connect() {
    const provider = getWeb3Provider();
    await provider.request({ method: 'eth_requestAccounts' });
    dispatch(walletConnected(true));

    const chainId = await provider.request({ method: 'eth_chainId' });

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
  }

  function handleChainChanged(chainId: number) {
    console.log(chainId);
  }

  function handleAccountsChanged() {
  }
  
  function renderContent() {
    return <>
      {
        !wallet.isWalletConnected && <button onClick={() => connect()}>Connect</button>
      }
      <form onSubmit={e => deploy(e)}>
        <label>Choose the Release date. Please note that you can only do this ONCE. After that, you fund won't be available until the Release date and you won't be able to change it!</label><br/>
        <DatePicker selected={date} onChange={(value: any) => setDate(value)}/><br/>
        <button>Create Vault</button>
      </form>
      <button onClick={() => transfer()}>Transfer fund to your Vault </button>
    </>
  }

  return (
    <div className="App">
    {
      wallet.isMetaMaskInstalled ? renderContent() : <button>Please install MetaMask</button>
    }
      
    </div>
  );
}

export default App;
